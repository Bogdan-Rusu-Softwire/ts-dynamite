import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    private playerHistory: BotSelection[] = [];
    private moveTransitions: { [key in BotSelection]: { [key in BotSelection]: number } } = {
        'R': { 'R': 0, 'P': 0, 'S': 0, 'D': 0, 'W': 0 },
        'P': { 'R': 0, 'P': 0, 'S': 0, 'D': 0, 'W': 0 },
        'S': { 'R': 0, 'P': 0, 'S': 0, 'D': 0, 'W': 0 },
        'D': { 'R': 0, 'P': 0, 'S': 0, 'D': 0, 'W': 0 },
        'W': { 'R': 0, 'P': 0, 'S': 0, 'D': 0, 'W': 0 }
    };
    private consecutiveDraws: number = 0;

    private updateTransitionMatrix(previousMove: BotSelection, currentMove: BotSelection): void {
        this.moveTransitions[previousMove][currentMove]++;
    }

    private getMostLikelyNextMove(): BotSelection {
        if (this.playerHistory.length === 0) {
            const moves: BotSelection[] = ['R', 'P', 'S', 'D', 'W'];
            return moves[Math.floor(Math.random() * moves.length)];
        }

        const lastMove = this.playerHistory[this.playerHistory.length - 1];
        const transitionCounts = this.moveTransitions[lastMove];
        let mostLikelyMove: BotSelection = 'R';
        let highestCount = 0;

        for (const move in transitionCounts) {
            if (transitionCounts[move as BotSelection] > highestCount) {
                highestCount = transitionCounts[move as BotSelection];
                mostLikelyMove = move as BotSelection;
            }
        }

        return mostLikelyMove;
    }

    private getCounterMove(predictedMove: BotSelection): BotSelection {
        switch (predictedMove) {
            case 'R':
                return 'P';
            case 'P':
                return 'S';
            case 'S':
                return 'R';
            case 'D':
                return 'W'; // Water bomb beats dynamite
            case 'W':
                return 'P'; // Water bomb is only countered by paper (arbitrary choice)
            default:
                return 'R';
        }
    }

    public makeMove(gamestate: Gamestate): BotSelection {
        if (gamestate.rounds.length > 0) {
            const lastRound = gamestate.rounds[gamestate.rounds.length - 1];
            const previousMove = this.playerHistory[this.playerHistory.length - 1];
            const currentMove = lastRound.p1;

            this.updateTransitionMatrix(previousMove, currentMove);
            this.playerHistory.push(currentMove);

            if (lastRound.p1 === lastRound.p2) {
                this.consecutiveDraws++;
            } else {
                this.consecutiveDraws = 0;
            }
        }

        const predictedMove = this.getMostLikelyNextMove();
        const counterMove = this.getCounterMove(predictedMove);
        console.log(counterMove);

        return counterMove;
    }
}

export = new Bot();
