import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LichessGameInterface } from './lichess-game.interface';

const lichessTournamentIdControlName = 'lichessTournamentId';

interface PlayerGamesCountInterface {
    player: string;
    gamesCount: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    public readonly lichessTournamentIdControlName = lichessTournamentIdControlName;
    public idForm = new FormGroup({
        [lichessTournamentIdControlName]: new FormControl(''),
    });
    public playersGamesCount: PlayerGamesCountInterface[] = [];
    public status = '';

    constructor(private httpClient: HttpClient) {}

    public generateTable(): void {
        const tournamentId = this.idForm.get(lichessTournamentIdControlName).value; // 0Osbn51X for testing

        debugger;

        this.status = 'Loading...';

        this.httpClient
            .get(`https://lichess.org/api/swiss/${tournamentId}/games`, {
                headers: {
                    Accept: 'application/x-ndjson',
                },
                responseType: 'text',
            })
            .subscribe(
                (listOfJson: string) => {
                    this.parseResults(listOfJson);
                    this.status = '';
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 404) {
                        this.status = 'Error! No swiss tournament found';

                        return;
                    }

                    this.status = 'Network error';
                },
            );
    }

    private parseResults(listOfJson: string): void {
        const lichessTournamentGames: LichessGameInterface[] = JSON.parse(
            `[${listOfJson
                .split('\n')
                .filter((line) => !!line)
                .join(',')}]`,
        );

        const players: string[] = [];

        lichessTournamentGames.forEach((game: LichessGameInterface) => {
            players.push(game.players.white.user.name);
            players.push(game.players.black.user.name);
        });

        const playersGamesCount: Record<string, number> = players.reduce((acc, elem) => {
            debugger;

            return acc[elem] ? { ...acc, [elem]: acc[elem] + 1 } : { ...acc, [elem]: 1 };
        }, {});

        this.playersGamesCount = Object.entries(playersGamesCount).map(([player, gamesCount]: [string, number]) => ({
            player,
            gamesCount,
        }));
    }
}
