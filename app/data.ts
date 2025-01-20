////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    avatar:
      "https://img-cdn.thepublive.com/fit-in/853x480/filters:format(webp)/wion/media/post_attachments/files/2023/07/04/364361-oppenheimer.png",
    first: "Oppenheimer",
    last: "2023",
    twitter: "oppenheimermovie",
  },
  {
    avatar:
      "https://es.web.img3.acsta.net/pictures/22/04/26/16/27/2834053.jpg",
    first: "Everything Everywhere All at Once",
    last: "2022",
    twitter: "everythingeverywheremovie",
  },
  {
    avatar:
      "https://pics.filmaffinity.com/CODA_Los_sonidos_del_silencio-473710521-large.jpg",
    first: "CODA",
    last: "2021",
    twitter: "codamovie",
  },
  {
    avatar:
      "https://play-lh.googleusercontent.com/AS3pAU3RZ0FyXvne18ievyWWi-Zda7yCQw5z48ue0kJp8pcEPS86E_D8iueRvaGmK-bxgtLC83UwAR0ZwkE",
    first: "Nomadland",
    last: "2020",
    twitter: "nomadlandfilm",
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcyJYd_sWzQdj87gwIiDRpi6JtzfY6-XLG-w&s",
    first: "Parasite",
    last: "2019",
    twitter: "parasitemovie",
  },
  {
    avatar:
      "https://m.media-amazon.com/images/M/MV5BNDU5YTNmMmItN2QxNy00OGQ0LTg5MTctNzFmYjEzZjcwN2UwXkEyXkFqcGc@._V1_.jpg",
    first: "Green Book",
    last: "2018",
    twitter: "greenbookmovie",
  },
  {
    avatar:
      "https://m.media-amazon.com/images/M/MV5BOGFlMTM2MTgtZDdlMy00ZDZlLWFjOTUtZDMzMGEwNmNiMWY0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    first: "The Shape of Water",
    last: "2017",
    twitter: "shapeofwatermovie",
  },
  {
    avatar:
      "https://m.media-amazon.com/images/M/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyMDA3OTE@._V1_.jpg",
    first: "Moonlight",
    last: "2016",
    twitter: "moonlightmov",
  },
  {
    avatar:
      "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11897076_p_v13_am.jpg",
    first: "Spotlight",
    last: "2015",
    twitter: "spotlightmovie",
  },
  {
    avatar:
      "https://m.media-amazon.com/images/M/MV5BODAzNDMxMzAxOV5BMl5BanBnXkFtZTgwMDMxMjA4MjE@._V1_.jpg",
    first: "Birdman",
    last: "2014",
  },
].forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase()}-${contact.last.toLocaleLowerCase()}`,
  });
});
