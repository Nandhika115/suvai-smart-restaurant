// lib/store.js

const { hashPassword } = require("./auth");

function seed() {

  const menu = [

    {
      id: "m1",
      name: "Chicken Biryani",
      category: "Main Course",
      price: 320,
      veg: false,
      available: true,
      stock: 25,
      image: "/dishes/chicken-biryani.jpg",
      description: "Aromatic basmati rice with spiced chicken."
    },

    {
      id: "m2",
      name: "Mutton Biryani",
      category: "Main Course",
      price: 420,
      veg: false,
      available: true,
      stock: 10,
      image: "/dishes/mutton-biryani.jpg",
      description: "Traditional biryani with tender mutton pieces."
    },

    {
      id: "m3",
      name: "Mushroom Biryani",
      category: "Main Course",
      price: 260,
      veg: true,
      available: true,
      stock: 15,
      image: "/dishes/mushroom-biryani.jpg",
      description: "Fragrant basmati rice cooked with mushrooms."
    },

    {
      id: "m4",
      name: "Paneer Butter Masala",
      category: "Main Course",
      price: 280,
      veg: true,
      available: true,
      stock: 15,
      image: "/dishes/paneer-butter-masala.jpg",
      description: "Soft paneer cooked in rich tomato butter gravy."
    },

    {
      id: "m5",
      name: "Gobi 65",
      category: "Starters",
      price: 180,
      veg: true,
      available: true,
      stock: 20,
      image: "/dishes/gobi-65.jpg",
      description: "Crispy cauliflower tossed with Indian spices."
    },

    {
      id: "m6",
      name: "Chicken 65",
      category: "Starters",
      price: 240,
      veg: false,
      available: true,
      stock: 25,
      image: "/dishes/chicken-65.jpg",
      description: "Spicy crispy chicken starter with aromatic spices."
    },

    {
      id: "m7",
      name: "Butter Naan",
      category: "Breads",
      price: 60,
      veg: true,
      available: true,
      stock: 30,
      image: "/dishes/butter-naan.jpg",
      description: "Soft naan topped with butter."
    },

    {
      id: "m8",
      name: "Fish Curry Meals",
      category: "Main Course",
      price: 380,
      veg: false,
      available: true,
      stock: 15,
      image: "/dishes/fish-curry-meals.jpg",
      description: "Traditional fish curry served with rice and sides."
    },

    {
      id: "m9",
      name: "Mango Lassi",
      category: "Beverages",
      price: 120,
      veg: true,
      available: true,
      stock: 20,
      image: "/dishes/mango-lassi.jpg",
      description: "Refreshing yogurt-based mango drink."
    },

    {
      id: "m10",
      name: "Rasagulla",
      category: "Desserts",
      price: 100,
      veg: true,
      available: true,
      stock: 20,
      image: "/dishes/rasagulla.jpg",
      description: "Soft cottage cheese dumplings soaked in sugar syrup."
    },

    {
      id: "m11",
      name: "Gulab Jamun",
      category: "Desserts",
      price: 90,
      veg: true,
      available: true,
      stock: 30,
      image: "/dishes/gulab-jamun.jpg",
      description: "Sweet milk dumplings soaked in sugar syrup."
    },

    {
      id: "m12",
      name: "Filter Coffee",
      category: "Beverages",
      price: 70,
      veg: true,
      available: true,
      stock: 50,
      image: "/dishes/filter-coffee.jpg",
      description: "South Indian filter coffee with rich aroma."
    },

    {
      id: "m13",
      name: "Masala Dosa",
      category: "Breakfast",
      price: 120,
      veg: true,
      available: true,
      stock: 18,
      image: "/dishes/masala-dosa.jpg",
      description: "Crispy dosa served with potato masala."
    },

    {
      id: "m14",
      name: "Veg Fried Rice",
      category: "Main Course",
      price: 180,
      veg: true,
      available: true,
      stock: 40,
      image: "/dishes/veg-fried-rice.jpg",
      description: "Stir-fried rice with fresh vegetables."
    }

  ];


  const tables = [
    { id:"t1", name:"T1", capacity:2, status:"available", zone:"Window" },
    { id:"t2", name:"T2", capacity:2, status:"occupied", zone:"Window" },
    { id:"t3", name:"T3", capacity:4, status:"available", zone:"Main Hall" },
    { id:"t4", name:"T4", capacity:4, status:"reserved", zone:"Main Hall" },
    { id:"t5", name:"T5", capacity:6, status:"available", zone:"Patio" },
    { id:"t6", name:"T6", capacity:8, status:"cleaning", zone:"Private" }
  ];


  const inventory = [];


  const staff = [

    {
      id:"s1",
      name:"Ananya Rao",
      role:"Head Chef",
      shift:"10:00 - 19:00",
      status:"on-duty"
    },

    {
      id:"s2",
      name:"Vikram Sethi",
      role:"Server",
      shift:"12:00 - 21:00",
      status:"on-duty"
    },

    {
      id:"s3",
      name:"Priya Sharma",
      role:"Kitchen Assistant",
      shift:"09:00 - 18:00",
      status:"on-duty"
    },

    {
      id:"s4",
      name:"Rahul Kumar",
      role:"Cashier",
      shift:"13:00 - 22:00",
      status:"off-duty"
    }

  ];


  const users = [

    {
      id:"u1",
      name:"Restaurant Admin",
      email:"admin@smartbistro.app",
      role:"admin",
      passwordHash:"1d98adc7d5376cbc9566347a08620398:b7717bd5c220d5d3a137a572eeebd7fea789e8c78175582b3ca88e88a0018e65fa644ef427815fca6a43720b1b1841f4cd089fcf0143da995a2b7f77b41f3497",
      otp:null
    },

    {
      id:"u2",
      name:"Demo Customer",
      email:"guest@smartbistro.app",
      role:"customer",
      passwordHash:"7698f636626667626dcf34b99ba32522:ff1b269ac9a869b2987251430186ae9e7ca86cbee683c9862478e59ce6a4d3e6673264e3e6d9f7455ef84ac05bb29f11cc0606870fb4749d5f5c0df04a2d223c",
      otp:null
    }

  ];


  const orders = [];

  const reservations = [];


  return {
    menu,
    tables,
    inventory,
    staff,
    users,
    orders,
    reservations,
    salesLog:[]
  };

}



function getStore(){

  if(!globalThis.__SRO_STORE__){
    globalThis.__SRO_STORE__ = seed();
  }

  return globalThis.__SRO_STORE__;

}



function uid(prefix){

  return `${prefix}${Math.random().toString(36).slice(2,9)}`;

}



module.exports = {
  getStore,
  uid
};