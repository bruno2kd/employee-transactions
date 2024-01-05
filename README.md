# ADP Innovation Labs Pre-Interview Assignment

This is an app built for the ADP Brazil Labs pre-interview assignment following the instructions available [here](https://interview.adpeai.com/). 

## Installation

  1. Run `npm install`
  2. Run `npm run serve` to start a server on port 8000.
  3. Click the button to view the results on the screen.

## Requirements

- Node.js version 20 or higher

## Usage

The home screen at `/` allows you to click a button that triggers a `GET` request to the endpoint `/api/adp-test?type=alpha`. The results will be displayed on the screen. Accessing any other endpoint will return a `Not Found` screen.

## Considerations

- Fun and simple app built with no frameworks or libraries
- Main calculation is done with time complexity O(n) using a `reduce` function
- It was not clear to me what format was requested so I made an alternative way to see the results, just run `npm start` and the result will be printed in the console 
- Instructions document: https://interview.adpeai.com/