import axios from "axios";

/* API CONFIG*/

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


/* CREATE TICKET*/

export async function createTicket(data) {
  try {

    const res = await API.post("/ticket", data);

    return res.data;

  } catch (err) {

    console.error("Create Ticket Error:", err);
    throw err;
  }
}


/* GET ALL TICKETS*/

export async function getTickets() {

  try {

    const res = await API.get("/tickets");

    return res.data;

  } catch (err) {

    console.error("Get Tickets Error:", err);

    return [];
  }
}


/* GET SINGLE TICKET (TRACKER)*/

export async function getTicket(id) {

  if (!id) return null;

  try {

    // Get FULL ticket
    const res = await API.get(`/ticket/${id}`);

    return res.data;

  } catch (err) {

    // Handle deleted / missing ticket
    if (err.response?.status === 404) {

      console.warn("Ticket not found:", id);
      return null;
    }

    console.error("Get Ticket Error:", err);

    return null;
  }
}

export async function resolveTicket(id) {

  try {
    const res = await API.put(`/ticket/${id}/resolve`);
    return res.data;
  } catch (err) {
    console.error("Resolve Ticket Error:", err);
    return null;
  }
}