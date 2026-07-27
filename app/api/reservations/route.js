import { NextResponse } from "next/server";
import { getStore, uid } from "../../../lib/store";
import { transporter } from "../../../lib/email";


// Get reservations
export async function GET() {
  const store = getStore();

  return NextResponse.json({
    reservations: [...store.reservations].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    ),
  });
}


// Create reservation
export async function POST(req) {
  try {

    const { name, email, partySize, date } = await req.json();

    const size = Number(partySize);


    if (!name || !email || !size || !date) {
      return NextResponse.json(
        {
          error: "Name, email, party size and date/time are required.",
        },
        {
          status: 400,
        }
      );
    }


    const store = getStore();


    // Find smallest available table
    const candidate = store.tables
      .filter(
        (table) =>
          table.status === "available" &&
          table.capacity >= size
      )
      .sort(
        (a, b) => a.capacity - b.capacity
      )[0];


    if (!candidate) {
      return NextResponse.json(
        {
          error: "No tables available right now.",
        },
        {
          status: 409,
        }
      );
    }


    // Reserve table
    candidate.status = "reserved";


    const reservation = {

      id: uid("r"),

      customerName: name,

      customerEmail: email,

      partySize: size,

      tableId: candidate.id,

      date,

      status: "confirmed",

      createdAt: Date.now(),

    };


    store.reservations.push(reservation);



    // Send confirmation email using Gmail SMTP

    console.log("Sending email to:", email);


    const emailResponse = await transporter.sendMail({

      from: `"Suvai Restaurant" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Suvai Restaurant - Table Reservation Confirmed",


      html: `

      <div style="font-family:Arial,sans-serif">

        <h2>🎉 Reservation Confirmed</h2>


        <p>Hello <b>${name}</b>,</p>


        <p>
          Your table has been successfully booked at
          <b>Suvai Restaurant</b>.
        </p>


        <h3>Reservation Details</h3>


        <p>
          <b>Date & Time:</b> ${date}
        </p>


        <p>
          <b>Number of Guests:</b> ${size}
        </p>


        <p>
          <b>Table:</b> ${candidate.name}
        </p>


        <p>
          Thank you for choosing Suvai Restaurant ❤️
        </p>


        <p>
          We look forward to serving you.
        </p>


      </div>

      `,

    });


    console.log("EMAIL SENT:", emailResponse.messageId);



    return NextResponse.json(

      {
        message: "Reservation confirmed. Confirmation email sent.",
        reservation,
        table: candidate,
      },

      {
        status: 201,
      }

    );


  } catch(error) {


    console.error("EMAIL / RESERVATION ERROR:", error);


    return NextResponse.json(

      {
        error: error.message || "Something went wrong",
      },

      {
        status: 500,
      }

    );

  }
}