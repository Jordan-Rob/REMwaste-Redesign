import { users, skips, type User, type InsertUser, type Skip, type InsertSkip } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSkips(): Promise<Skip[]>;
  getSkipsByLocation(postcode: string, area?: string): Promise<Skip[]>;
  createSkip(skip: InsertSkip): Promise<Skip>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private skips: Map<number, Skip>;
  private currentUserId: number;
  private currentSkipId: number;

  constructor() {
    this.users = new Map();
    this.skips = new Map();
    this.currentUserId = 1;
    this.currentSkipId = 1;
    
    // Add demo data for NR32 Lowestoft area
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoSkips = [
      {
        size: 4,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "278",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: true,
        allows_heavy_waste: true
      },
      {
        size: 6,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "320",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: true,
        allows_heavy_waste: true
      },
      {
        size: 8,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "385",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: false,
        allows_heavy_waste: true
      },
      {
        size: 10,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "435",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: false,
        allows_heavy_waste: true
      },
      {
        size: 12,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "485",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: false,
        allows_heavy_waste: true
      },
      {
        size: 14,
        hire_period_days: 14,
        transport_cost: null,
        per_tonne_cost: null,
        price_before_vat: "535",
        vat: "20",
        postcode: "NR32",
        area: "Lowestoft",
        forbidden: false,
        allowed_on_road: false,
        allows_heavy_waste: true
      }
    ];

    demoSkips.forEach(skipData => {
      this.createSkip(skipData);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSkips(): Promise<Skip[]> {
    return Array.from(this.skips.values());
  }

  async getSkipsByLocation(postcode: string, area?: string): Promise<Skip[]> {
    const allSkips = Array.from(this.skips.values());
    return allSkips.filter(skip => {
      const postcodeMatch = skip.postcode.toLowerCase().includes(postcode.toLowerCase());
      const areaMatch = !area || skip.area.toLowerCase().includes(area.toLowerCase());
      return postcodeMatch && areaMatch;
    });
  }

  async createSkip(insertSkip: InsertSkip): Promise<Skip> {
    const id = this.currentSkipId++;
    const skip: Skip = { 
      ...insertSkip, 
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.skips.set(id, skip);
    return skip;
  }
}

export const storage = new MemStorage();
