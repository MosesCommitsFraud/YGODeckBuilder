import axios from "axios"
import { Card } from "./types" // Import Card type from a single source

let cardCache: Card[] = []

export const downloadCardDB = async (): Promise<Card[]> => {
  if (cardCache.length === 0) {
    try {
      const response = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php")
      cardCache = response.data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        type: card.type,
        rarity: card.rarity,
        description: card.desc,
        image_url: card.card_images[0]?.image_url || "",
        tags: card.race ? [card.race] : [], // Example for tags
      }))
    } catch (error) {
      console.error("Error fetching card database: ", error)
      return []
    }
  }
  return cardCache
}
