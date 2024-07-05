import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    dynamiteCount: number = 0;
    DYNAMITE_MAX_COUNTER: number = 100;

    private getRandomOriginalMove(isWaterUsedFrequently: boolean, gameState:Gamestate): BotSelection {

        let originalMoves: BotSelection[] = ['S', 'R', 'P'];
        if (this.dynamiteCount < this.DYNAMITE_MAX_COUNTER) {
            originalMoves.push('D');
            originalMoves.push('D');
            originalMoves.push('D');

            if (gameState.rounds.slice(-3).filter(round => round.p2 === round.p1).length == 3 &&
                gameState.rounds.slice(-3).filter(round => round.p2 === 'D').length == 3)
                    return 'W';

            if (gameState.rounds.length > 0 && gameState.rounds.slice(-1).filter(round => round.p2 === round.p1).length >= 1) {
                this.dynamiteCount++;
                return 'D';
            }
        }
        if (gameState.rounds.slice(-3).filter(round => round.p2 === 'R').length >= 2) {
            return 'P';
        }
        if (gameState.rounds.slice(-3).filter(round => round.p2 === 'S').length >= 2) {
            return 'R';
        }
        if (gameState.rounds.slice(-3).filter(round => round.p2 === 'P').length >= 2) {
            return 'S';
        }

        const randIndex = Math.floor(Math.random() * originalMoves.length);
        if (originalMoves[randIndex] === 'D')
            this.dynamiteCount++;
        return originalMoves[randIndex];
    }

    makeMove(gamestate: Gamestate): BotSelection {
        const opponentDynamiteUsedCount = gamestate.rounds.slice(-5).filter(round => round.p2 === 'D').length;
        const opponentWaterUsedCount: number = gamestate.rounds.slice(-5).filter(round => round.p2 === 'W').length;
        const lastMovesCount: number = gamestate.rounds.slice(-5).length;

        if (opponentDynamiteUsedCount * 2 > gamestate.rounds.length) {
            return 'W';
        }

        let isWaterUsedFrequently = false;
        if (opponentWaterUsedCount * 2 > gamestate.rounds.length) {
            isWaterUsedFrequently = true;
        }

        return this.getRandomOriginalMove(isWaterUsedFrequently, gamestate);
    }
}

export = new Bot();
