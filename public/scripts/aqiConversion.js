//helper function
function truncate(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor; 
}

//breakpoint table

const BREAKPOINTS = {
  pm25: [
    { c_lo: 0.0,   c_hi: 12.0,  i_lo: 0,   i_hi: 50 },
    { c_lo: 12.1,  c_hi: 35.4,  i_lo: 51,  i_hi: 100 },
    { c_lo: 35.5,  c_hi: 55.4,  i_lo: 101, i_hi: 150 },
    { c_lo: 55.5,  c_hi: 150.4, i_lo: 151, i_hi: 200 },
    { c_lo: 150.5, c_hi: 250.4, i_lo: 201, i_hi: 300 },
    { c_lo: 250.5, c_hi: 350.4, i_lo: 301, i_hi: 400 },
    { c_lo: 350.5, c_hi: 500.4, i_lo: 401, i_hi: 500 }
  ],
  pm10: [
    { c_lo: 0,   c_hi: 54,   i_lo: 0,   i_hi: 50 },
    { c_lo: 55,  c_hi: 154,  i_lo: 51,  i_hi: 100 },
    { c_lo: 155, c_hi: 254,  i_lo: 101, i_hi: 150 },
    { c_lo: 255, c_hi: 354,  i_lo: 151, i_hi: 200 },
    { c_lo: 355, c_hi: 424,  i_lo: 201, i_hi: 300 },
    { c_lo: 425, c_hi: 504,  i_lo: 301, i_hi: 400 },
    { c_lo: 505, c_hi: 604,  i_lo: 401, i_hi: 500 }
  ]
};

function interpAQI(C, breakpoints) {
  for (const bp of breakpoints) {
    if (C >= bp.c_lo && C <= bp.c_hi) {
      const { c_lo, c_hi, i_lo, i_hi } = bp;
      const I = ((i_hi - i_lo) / (c_hi - c_lo)) * (C - c_lo) + i_lo;
      return Math.round(I); 
    }
  }
  return null;
}

export function getAqiSummary(aqi) {
  if (aqi <= 50) {return 'Good'; }
  else if (aqi > 50 && aqi <= 100) {return 'Fair';}
  else if (aqi > 100 && aqi <= 150) {return 'Moderate';}
  else if (aqi > 150 && aqi <= 200) {return 'Poor';}
  else if (aqi > 200 && aqi <= 300) {return 'Very-poor';}
}

export function getAqiColor(aqi) {
  if (aqi <= 50) {return "rgb(0, 212, 39)"; }
  else if (aqi > 50 && aqi <= 100) { return "rgb(0, 197, 197)"; }
  else if (aqi > 100 && aqi <= 150) {return "orange" ; }
  else if (aqi > 150 && aqi <= 200) {return "red"; }
  else if (aqi > 200 && aqi <= 300) {return "purple";}
}

export function computeAQI(pm25, pm10) {
  const pm25Trunc = truncate(pm25, 1); // 1 decimal
  const pm10Trunc = truncate(pm10, 0); // integer

  const pm25AQI = interpAQI(pm25Trunc, BREAKPOINTS.pm25);
  const pm10AQI = interpAQI(pm10Trunc, BREAKPOINTS.pm10);

  const overallAQI = Math.max(pm25AQI, pm10AQI);

  return overallAQI;
}
