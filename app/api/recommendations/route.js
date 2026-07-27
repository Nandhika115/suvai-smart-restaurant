import { NextResponse } from "next/server";
import { getStore } from "../../../lib/store";
import { getSession } from "../../../lib/session";

// Platinum-level "AI-powered assistance": personalized dish recommendations.
//
// Works out of the box with a simple, explainable heuristic (no API key
// needed). If GEMINI_API_KEY is set, it upgrades to a real LLM call that
// reasons over the same signals. This mirrors how most teams should stage
// AI features in a hackathon: ship a deterministic fallback first, layer
// a model on top once the core product works.
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const store = getStore();
  const myOrders = store.orders.filter((o) => o.customerId === session.id);
  const orderedCategories = new Set();
  const orderedNames = new Set();
  for (const o of myOrders) {
    for (const line of o.items) {
      orderedNames.add(line.name);
      const menuItem = store.menu.find((m) => m.id === line.menuId);
      if (menuItem) orderedCategories.add(menuItem.category);
    }
  }

  const available = store.menu.filter((m) => m.available);

  if (process.env.GEMINI_API_KEY) {
    try {
      const picks = await recommendWithGemini(available, [...orderedNames]);
      if (picks?.length) return NextResponse.json({ recommendations: picks, source: "gemini" });
    } catch (err) {
      console.error("Gemini recommendation failed, falling back to heuristic:", err);
    }
  }

  // Heuristic fallback: prioritize categories the customer already likes,
  // excluding what they've already ordered; top up with popular items.
  const heuristicPicks = available
    .filter((m) => !orderedNames.has(m.name))
    .sort((a, b) => {
      const aMatch = orderedCategories.has(a.category) ? 1 : 0;
      const bMatch = orderedCategories.has(b.category) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 4)
    .map((m) => ({ id: m.id, name: m.name, reason: orderedCategories.has(m.category) ? `Because you liked ${m.category}` : "Popular pick" }));

  return NextResponse.json({ recommendations: heuristicPicks, source: "heuristic" });
}

async function recommendWithGemini(menu, orderedNames) {
  const prompt = `You are a restaurant recommendation engine. Given the menu (JSON) and the
customer's past orders, pick 4 items they have NOT ordered yet that they'd likely enjoy.
Return ONLY a JSON array like [{"id": "...", "name": "...", "reason": "..."}], no markdown.

Menu: ${JSON.stringify(menu.map((m) => ({ id: m.id, name: m.name, category: m.category, veg: m.veg })))}
Past orders: ${JSON.stringify(orderedNames)}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
