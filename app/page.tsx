"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card as UiCard, CardContent } from "@/components/ui/card" // Avoid name collision by aliasing this component
import { downloadCardDB } from "@/lib/cardCache"

// Define the Card type based on your expected data structure
type Card = {
  id: number
  name: string
  type: string
  rarity: string
  description: string
  image_url: string
  tags: string[]
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredCards, setFilteredCards] = useState<Card[]>([]) // Typing the state as an array of Card objects
  const [selectedCards, setSelectedCards] = useState<number[]>([]) // Typing the state as an array of numbers
  const [allCards, setAllCards] = useState<Card[]>([]) // Full card database for filtering
  const [isLoading, setIsLoading] = useState<boolean>(true) // Loading state

  useEffect(() => {
    // Fetch the card database when the component is mounted
    const fetchCards = async () => {
      setIsLoading(true) // Start loading spinner
      const cardData = await downloadCardDB() // Fetch API data and update state
      setAllCards(cardData) // Store the full card database in allCards
      setFilteredCards(cardData.slice(0, 5)) // Initially display first 5 cards
      setIsLoading(false) // Stop loading spinner
    }
    fetchCards()
  }, [])

  // Update filtered cards based on the search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredCards(
          allCards.filter(card =>
              card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          ).slice(0, 5) // Limit to 5 results
      )
    } else {
      setFilteredCards(allCards.slice(0, 5)) // Reset filtered cards if search is cleared
    }
  }, [searchTerm, allCards]) // Depend on both searchTerm and allCards

  const handleSelectCard = (cardId: number) => {
    if (!selectedCards.includes(cardId)) {
      setSelectedCards(prev => [...prev, cardId])
    }
    setSearchTerm("")
  }

  const handleRemoveCard = (cardId: number) => {
    setSelectedCards(prev => prev.filter(id => id !== cardId))
  }

  // Get selected cards from allCards based on selectedCards state
  const selectedCardDetails = selectedCards.map(id => allCards.find(card => card.id === id)).filter(Boolean) as Card[]

  return (
      <TooltipProvider>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Card Catalogue</h1>

          {/* Show loading spinner while the card database is being fetched */}
          {isLoading ? (
              <div className="flex justify-center items-center">
                <p className="text-xl font-semibold">Loading card database...</p>
              </div>
          ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex p-4 space-x-4">
                    {selectedCardDetails.length > 0 ? (
                        selectedCardDetails.map(card => (
                            <Tooltip key={card.id}>
                              <TooltipTrigger asChild>
                                <div className="w-40 shrink-0">
                                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={card.image_url || "/placeholder.svg"}
                                        alt={card.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveCard(card.id)
                                        }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Remove {card.name}</span>
                                    </Button>
                                  </div>
                                  <h3 className="font-semibold text-sm truncate">{card.name}</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {card.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="w-64">
                                <div className="flex flex-col items-center">
                                  <p className="text-sm font-semibold">{card.name}</p>
                                  <p className="text-xs text-muted-foreground">{card.type} - {card.rarity}</p>
                                  <p className="text-sm mt-2">{card.description}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                        ))
                    ) : (
                        <p className="text-muted-foreground p-4">No cards selected</p>
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-8">
                  <Input
                      type="search"
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4"
                  />
                  {searchTerm && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {filteredCards.map(card => (
                            <Tooltip key={card.id}>
                              <TooltipTrigger asChild>
                                <UiCard
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => handleSelectCard(card.id)}
                                >
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold mb-1 truncate">{card.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{card.type} - {card.rarity}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {card.tags.map(tag => (
                                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </UiCard>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="w-64">
                                <div className="flex flex-col items-center">
                                  <img
                                      src={card.image_url || "/placeholder.svg"}
                                      alt={card.name}
                                      className="w-24 h-24 object-cover mb-2 rounded"
                                  />
                                  <p className="text-sm font-semibold">{card.name}</p>
                                  <p className="text-xs text-muted-foreground">{card.type} - {card.rarity}</p>
                                  <p className="text-sm mt-2">{card.description}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                        ))}
                      </div>
                  )}
                </div>
              </>
          )}
        </div>
      </TooltipProvider>
  )
}
