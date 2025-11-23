import type { GameRoom, RoundData, MiniGameType, PlayerResult } from '@minigame/shared';
import { GAME_CONSTANTS } from '@minigame/shared';

export class GameEngine {
  async startGame(room: GameRoom): Promise<void> {
    if (room.state !== 'lobby') {
      throw new Error('Game already started');
    }

    if (room.players.length < GAME_CONSTANTS.MIN_PLAYERS) {
      throw new Error('Not enough players');
    }

    room.state = 'countdown';
    room.currentRound = 0;
    console.log(`🎮 Starting game in room ${room.code}`);
  }

  selectRandomMinigame(room: GameRoom): MiniGameType {
    const enabledGames = room.config.enabledMinigames;
    const randomIndex = Math.floor(Math.random() * enabledGames.length);
    return enabledGames[randomIndex];
  }

  selectPlayersForRound(room: GameRoom): string[] {
    if (room.mode === 'team') {
      // Select one random player from each team
      return room.teams
        .map(team => {
          const teamPlayers = room.players.filter(p => p.teamId === team.id);
          if (teamPlayers.length === 0) return null;
          const randomIndex = Math.floor(Math.random() * teamPlayers.length);
          return teamPlayers[randomIndex].id;
        })
        .filter(Boolean) as string[];
    } else {
      // All players participate in FFA mode
      return room.players.map(p => p.id);
    }
  }

  createRound(room: GameRoom): RoundData {
    const roundNumber = room.currentRound + 1;
    const minigame = this.selectRandomMinigame(room);
    const selectedPlayers = this.selectPlayersForRound(room);

    const round: RoundData = {
      roundNumber,
      minigame,
      selectedPlayers,
      results: [],
      startTime: new Date(),
    };

    return round;
  }

  determineWinner(results: PlayerResult[], room: GameRoom): { winnerId: string; winnerTeamId?: string } {
    if (results.length === 0) {
      throw new Error('No results to determine winner');
    }

    // Sort by score (highest first), then by time (lowest first)
    const sortedResults = [...results].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.time || Infinity) - (b.time || Infinity);
    });

    const winnerId = sortedResults[0].playerId;
    
    let winnerTeamId: string | undefined;
    if (room.mode === 'team') {
      const winner = room.players.find(p => p.id === winnerId);
      winnerTeamId = winner?.teamId;
    }

    return { winnerId, winnerTeamId };
  }

  updateScores(room: GameRoom, winnerId: string, results: PlayerResult[], winnerTeamId?: string): void {
    console.log(`📈 Updating scores for ${results.length} players...`);

    // Update all players' stats with their scores
    results.forEach(result => {
      const player = room.players.find(p => p.id === result.playerId);
      if (player) {
        const oldScore = player.stats.totalScore;
        player.stats.totalScore += result.score;
        player.stats.roundsPlayed++;

        // Increment rounds won for the winner
        if (result.playerId === winnerId) {
          player.stats.roundsWon++;
        }

        console.log(`  ${player.name}: ${oldScore} + ${result.score} = ${player.stats.totalScore} (rounds won: ${player.stats.roundsWon})`);
      } else {
        console.log(`  ⚠️ Player not found: ${result.playerId}`);
      }
    });

    // Update team score
    if (room.mode === 'team' && winnerTeamId) {
      const team = room.teams.find(t => t.id === winnerTeamId);
      if (team) {
        team.score++;
      }
    }
  }

  isGameFinished(room: GameRoom): boolean {
    return room.currentRound >= room.config.numberOfRounds;
  }

  getFinalResults(room: GameRoom) {
    if (room.mode === 'team') {
      const sortedTeams = [...room.teams].sort((a, b) => b.score - a.score);
      return {
        winnerTeamId: sortedTeams[0]?.id,
        teams: sortedTeams.map(t => ({ teamId: t.id, score: t.score })),
      };
    } else {
      // Sort by total score (primary), then by rounds won (tiebreaker)
      const sortedPlayers = [...room.players].sort((a, b) => {
        if (b.stats.totalScore !== a.stats.totalScore) {
          return b.stats.totalScore - a.stats.totalScore;
        }
        return b.stats.roundsWon - a.stats.roundsWon;
      });
      return {
        winnerId: sortedPlayers[0]?.id,
        players: sortedPlayers.map(p => ({
          playerId: p.id,
          score: p.stats.totalScore,
          roundsWon: p.stats.roundsWon
        })),
      };
    }
  }
}

