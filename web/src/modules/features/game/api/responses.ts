export interface Game{
  id: string
  firstTeam: string
  secondTeam: string
  firstDate: string
  secondDate?: string
  cardsYellow?: number
  cardsRed?: number
  faults?: number
  amountGoalsFirstTeam?: number
  amountGoalsSecondTeam?: number
  winner?: string
  tournamentId: string
}