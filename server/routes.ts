import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // External API proxy endpoint to fetch skips from wewantwaste.co.uk
  app.get("/api/skips/by-location", async (req, res) => {
    try {
      const { postcode, area } = req.query;
      
      if (!postcode) {
        return res.status(400).json({ error: "Postcode is required" });
      }

      try {
        // First try external API
        const apiUrl = `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}${area ? `&area=${area}` : ''}`;
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          // Transform the data to match our schema format
          const transformedSkips = Array.isArray(data) ? data.map((skip: any) => ({
            id: skip.id,
            size: skip.size,
            hire_period_days: skip.hire_period_days,
            transport_cost: skip.transport_cost,
            per_tonne_cost: skip.per_tonne_cost,
            price_before_vat: skip.price_before_vat,
            vat: skip.vat,
            postcode: skip.postcode,
            area: skip.area || '',
            forbidden: skip.forbidden || false,
            allowed_on_road: skip.allowed_on_road !== false,
            allows_heavy_waste: skip.allows_heavy_waste !== false,
            created_at: skip.created_at,
            updated_at: skip.updated_at
          })) : [];

          return res.json(transformedSkips);
        }
      } catch (externalError) {
        console.warn('External API failed, falling back to local data:', externalError);
      }

      // Fallback to local storage if external API fails
      const localSkips = await storage.getSkipsByLocation(postcode as string, area as string);
      res.json(localSkips);
      
    } catch (error) {
      console.error('Error fetching skips:', error);
      res.status(500).json({ 
        error: "Failed to fetch skips", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Local skips endpoint (fallback for stored data)
  app.get("/api/skips", async (req, res) => {
    try {
      const { postcode, area } = req.query;
      
      let skips;
      if (postcode) {
        skips = await storage.getSkipsByLocation(postcode as string, area as string);
      } else {
        skips = await storage.getSkips();
      }
      
      res.json(skips);
    } catch (error) {
      console.error('Error fetching local skips:', error);
      res.status(500).json({ error: "Failed to fetch skips" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
