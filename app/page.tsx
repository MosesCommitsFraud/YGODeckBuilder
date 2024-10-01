"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card as UiCard, CardContent } from "@/components/ui/card"
import { downloadCardDB } from "@/lib/cardCache"

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
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [selectedCardCounts, setSelectedCardCounts] = useState<{ [key: number]: number }>({})
  const [allCards, setAllCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true)
      const cardData = await downloadCardDB()
      setAllCards(cardData)
      setFilteredCards(cardData.slice(0, 5))
      setIsLoading(false)
    }
    fetchCards()
  }, [])

  useEffect(() => {
    const filtered = allCards.filter(card => {
      const count = selectedCardCounts[card.id] || 0
      return count < 3 && (
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
    setFilteredCards(filtered.slice(0, 10))
  }, [searchTerm, allCards, selectedCardCounts])

  const handleSelectCard = (cardId: number) => {
    setSelectedCardCounts(prevCounts => {
      const count = prevCounts[cardId] || 0
      if (count < 3) {
        return { ...prevCounts, [cardId]: count + 1 }
      }
      return prevCounts
    })
    setSelectedCards(prev => {
      const count = selectedCardCounts[cardId] || 0
      if (count < 3) {
        return [...prev, cardId]
      }
      return prev
    })
    setSearchTerm("")
  }

  const handleRemoveCard = (cardId: number) => {
    setSelectedCardCounts(prevCounts => {
      const count = prevCounts[cardId] || 0
      if (count > 1) {
        return { ...prevCounts, [cardId]: count - 1 }
      } else {
        const { [cardId]: _, ...newCounts } = prevCounts
        return newCounts
      }
    })
    setSelectedCards(prev => {
      const index = prev.lastIndexOf(cardId)
      if (index !== -1) {
        const updatedSelectedCards = [...prev]
        updatedSelectedCards.splice(index, 1)
        return updatedSelectedCards
      }
      return prev
    })
  }

  const selectedCardDetails = selectedCards.map(id => allCards.find(card => card.id === id)).filter(Boolean) as Card[]

  return (
      <TooltipProvider>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Card Catalogue</h1>
          {isLoading ? (
              <div className="flex justify-center items-center">
                <p className="text-xl font-semibold">Loading card database...</p>
              </div>
          ) : (
              <div className="flex">
                {/* Left: Search bar and suggestions */}
                <div className="w-1/2 p-4">
                  <Input
                      type="search"
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4"
                  />
                  {searchTerm && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredCards.map(card => (
                            <Tooltip key={card.id} delayDuration={100} side="auto" align="center" sideOffset={5} collisionPadding={10}>
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
                              <TooltipContent className="w-auto max-w-sm">
                                <div className="flex flex-col items-center">
                                  <img
                                      src={card.image_url || "/placeholder.svg"}
                                      alt={card.name}
                                      className="w-20 h-20 object-contain mb-2"
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

                {/* Right: Selected cards */}
                <div className="w-1/2 p-4">
                  <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
                  <div className="w-full auto-height rounded-md border">
                    <div className="flex flex-wrap p-4 gap-4">
                      {selectedCardDetails.length > 0 ? (
                          selectedCardDetails.map((card, index) => (
                              <Tooltip key={card.id + "-" + index} delayDuration={100} side="auto" align="center" sideOffset={5} collisionPadding={10}>
                                <TooltipTrigger asChild>
                                  <div className="w-32 shrink-0 group relative">
                                    <div className="relative rounded-lg overflow-hidden mb-2">
                                      <img
                                          src={card.image_url || "/placeholder.svg"}
                                          alt={card.name}
                                          className="w-full h-full object-contain"
                                      />
                                      <Button
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveCard(card.id)
                                          }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove {card.name}</span>
                                      </Button>
                                    </div>
                                    <h3 className="font-semibold text-sm truncate text-center">{card.name}</h3>
                                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                                      {card.tags.map(tag => (
                                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="w-auto max-w-sm">
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
                  </div>
                </div>
              </div>
          )}
        </div>
      </TooltipProvider>
  )
}
