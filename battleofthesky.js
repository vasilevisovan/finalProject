const cityName = 'Seattle';
displayWeather(cityName);

async function fetchWeatherData(cityName) {
    const apiKey = 'API';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received Weather Data:', data); // Log the received data
        return data.current;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

async function displayWeather(cityName) {
    try {
        const weatherData = await fetchWeatherData(cityName);

        console.log('Weather Data:', weatherData); // Log the received data

        // Display weather information on the page
        const weatherWidget = document.getElementById('weather-widget');
        const weatherLogoElement = document.getElementById('weather-logo');
        const weatherTextElement = document.getElementById('weather-text');

        // Set background color based on weather conditions
        if (weatherData.condition.code === 113) {
            weatherLogoElement.innerHTML = '☀️'; // Use appropriate emoji for sunny weather
        } else if (weatherData.precip_mm > 0) {
            weatherLogoElement.innerHTML = '🌧️'; // Use appropriate emoji for rainy weather
        } else {
            weatherLogoElement.innerHTML = '🌥️'; // Use appropriate emoji for other weather conditions
        }

        // Convert temperature to Fahrenheit
        const temperatureFahrenheit = (weatherData.temp_c * 9/5) + 32;
        const isTemperatureValid = temperatureFahrenheit !== null && !isNaN(temperatureFahrenheit);

        // Display weather information
        weatherTextElement.innerHTML = `
            ${cityName} ${isTemperatureValid ? temperatureFahrenheit.toFixed(2) + '°F' : 'N/A'}
        `;

        // Display current date in the weather widget
        const currentDate = new Date().toLocaleDateString();
        weatherWidget.innerHTML += `<div class="date-label">${currentDate}</div>`;
    } catch (error) {
        console.error('Error displaying weather:', error);
    }
}
class BattlePlanesGame {
    static boardSize = 10;

    static createBoard(board) {
        for (let row = 0; row < BattlePlanesGame.boardSize; row++) {
            for (let col = 0; col < BattlePlanesGame.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => BattlePlanesGame.cellClick(board, row, col));
                board.appendChild(cell);
            }
        }
    }

    static placeAirplanes(board) {
        for (let i = 0; i < 3; i++) {
            let validPlacement = false;

            while (!validPlacement) {
                const startRow = Math.floor(Math.random() * (BattlePlanesGame.boardSize - 3));
                const startCol = Math.floor(Math.random() * (BattlePlanesGame.boardSize - 2));

                validPlacement = BattlePlanesGame.checkEmptyCells(board, startRow, startCol);

                if (validPlacement) {
                    BattlePlanesGame.setAirplaneCells(board, startRow, startCol, i + 1);
                }
            }
        }
    }

 

    static checkEmptyCells(board, startRow, startCol) {
        const airplaneCells = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
        ];

        for (let i = 0; i < airplaneCells.length; i++) {
            for (let j = 0; j < airplaneCells[i].length; j++) {
                const cell = board.querySelector(`[data-row="${startRow + i}"][data-col="${startCol + j}"]`);

                if (!cell || cell.classList.contains('airplane')) {
                    return false;
                }
            }
        }

        return true;
    }

    static setAirplaneCells(board, startRow, startCol, airplaneId) {
        const airplaneCells = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
        ];

        for (let i = 0; i < airplaneCells.length; i++) {
            for (let j = 0; j < airplaneCells[i].length; j++) {
                if (airplaneCells[i][j] === 1) {
                    const cell = board.querySelector(`[data-row="${startRow + i}"][data-col="${startCol + j}"]`);
                    cell.classList.add('airplane');
                    cell.dataset.airplaneId = airplaneId;

                    if (i === 1 && j === 1) {
                        cell.classList.add('head');
                    }
                }
            }
        }
    }

    static cellClick(board, row, col) {
        const clickedCell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
        if (board === board2) {
            const correspondingCell = board1.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
            if (correspondingCell.classList.contains('airplane')) {
                const airplaneId = correspondingCell.dataset.airplaneId;
                console.log(`Hit on board1! Airplane ID: ${airplaneId}`);
    
                board1.querySelectorAll(`.airplane[data-airplane-id="${airplaneId}"]`).forEach((cell) => {
                    cell.classList.add('dark-blue-head');
                });
    
                // Add a delay before activating the entire airplane
                setTimeout(() => {
                    board1.querySelectorAll(`.airplane[data-airplane-id="${airplaneId}"]`).forEach((cell) => {
                        cell.classList.add('activated');
                    });
                    
                    // Add a delay before making the airplane pulsate
                    setTimeout(() => {
                        board1.querySelectorAll(`.airplane[data-airplane-id="${airplaneId}"]`).forEach((cell) => {
                            cell.classList.add('pulsate');
                        });
                    }, 1000);
                }, 500);
    
                clickedCell.classList.add('red-brick');
            } else {
                console.log('Missed on board1!');
                clickedCell.classList.add('green-brick');
            }
        }
    
        clickedCell.style.pointerEvents = 'none';
    }

    static restartGame() {
        document.querySelectorAll('.airplane').forEach((cell) => {
            cell.classList.remove('airplane', 'head', 'dark-blue-head');
            cell.removeAttribute('data-airplane-id');
            cell.style.pointerEvents = 'auto';
        });

        document.querySelectorAll('.cell').forEach((cell) => {
            cell.classList.remove('red-brick', 'green-brick');
        });

        BattlePlanesGame.placeAirplanes(board1);
    }

    static animateAirplanes() {
        const airplanes = document.querySelectorAll('.airplane');

        airplanes.forEach((airplane, index) => {
            setTimeout(() => {
                airplane.classList.add('animated');
            }, index * 500);
        });
    }
     startGame() {
        const board1 = document.getElementById('board1');
        const board2 = document.getElementById('board2');

        BattlePlanesGame.createBoard(board1);
        BattlePlanesGame.createBoard(board2);

        BattlePlanesGame.placeAirplanes(board1);

        setTimeout(BattlePlanesGame.animateAirplanes, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const game = new BattlePlanesGame();
    game.startGame();

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', BattlePlanesGame.restartGame);
});