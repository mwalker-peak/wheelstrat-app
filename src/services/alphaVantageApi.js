class AlphaVantageAPI {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://www.alphavantage.co/query'
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Helper method to make API calls with caching
  async makeRequest(params) {
    const cacheKey = JSON.stringify(params)
    const cachedData = this.cache.get(cacheKey)
    
    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
      console.log('📋 Using cached data for:', params)
      return cachedData.data
    }

    const url = new URL(this.baseUrl)
    url.searchParams.append('apikey', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      console.log('🔗 Making Alpha Vantage API call:', url.toString())
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 API Response received')
      
      // Check for API error messages
      if (data['Error Message']) {
        throw new Error(data['Error Message'])
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded. Please try again later.')
      }

      if (data['Information']) {
        throw new Error('API call frequency limit reached. Please wait.')
      }

      // Cache the successful response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return data
    } catch (error) {
      console.error('❌ Alpha Vantage API Error:', error)
      throw error
    }
  }

  // Get real-time quote for a symbol
  async getQuote(symbol) {
    try {
      const data = await this.makeRequest({
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase()
      })
      
      const quote = data['Global Quote']
      if (!quote) {
        throw new Error(`No data found for symbol ${symbol}`)
      }
      
      return {
        symbol: quote['01. Symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'].replace('%', ''),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close']),
        lastUpdated: quote['07. latest trading day']
      }
    } catch (error) {
      console.error(`❌ Error fetching quote for ${symbol}:`, error)
      throw error
    }
  }

  // 🎯 NEW: Get real options chain data
  async getOptionsChain(symbol, date = null) {
    try {
      const params = {
        function: 'HISTORICAL_OPTIONS',
        symbol: symbol.toUpperCase()
      }
      
      if (date) {
        params.date = date // YYYY-MM-DD format
      }

      const data = await this.makeRequest(params)
      
      if (!data.data) {
        throw new Error(`No options data found for symbol ${symbol}`)
      }
      
      return this.parseOptionsData(data.data)
    } catch (error) {
      console.error(`❌ Error fetching options for ${symbol}:`, error)
      throw error
    }
  }

  // 🎯 NEW: Parse options data into usable format
  parseOptionsData(rawData) {
    const options = {
      calls: [],
      puts: []
    }

    if (!Array.isArray(rawData)) {
      return options
    }

    rawData.forEach(option => {
      const parsedOption = {
        contractSymbol: option.contractID,
        strike: parseFloat(option.strike),
        expirationDate: option.expiration,
        lastPrice: parseFloat(option.last),
        bid: parseFloat(option.bid),
        ask: parseFloat(option.ask),
        volume: parseInt(option.volume) || 0,
        openInterest: parseInt(option.open_interest) || 0,
        impliedVolatility: parseFloat(option.implied_volatility) || 0,
        delta: parseFloat(option.delta) || 0,
        gamma: parseFloat(option.gamma) || 0,
        theta: parseFloat(option.theta) || 0,
        vega: parseFloat(option.vega) || 0,
        type: option.type?.toLowerCase() || 'unknown'
      }

      if (parsedOption.type === 'put') {
        options.puts.push(parsedOption)
      } else if (parsedOption.type === 'call') {
        options.calls.push(parsedOption)
      }
    })

    return options
  }

  // 🎯 NEW: Get next few expiration dates
  async getExpirationDates(symbol) {
    try {
      // Alpha Vantage doesn't have a direct endpoint for expiration dates
      // We'll use a common approach to get the next few third Fridays
      return this.generateExpirationDates()
    } catch (error) {
      console.error(`❌ Error getting expiration dates:`, error)
      throw error
    }
  }

  // 🎯 NEW: Generate realistic expiration dates (3rd Friday of each month)
  generateExpirationDates(months = 6) {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < months; i++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const thirdFriday = this.getThirdFriday(targetMonth.getFullYear(), targetMonth.getMonth())
      
      // Only include future dates
      if (thirdFriday > today) {
        dates.push({
          date: thirdFriday.toISOString().split('T')[0],
          dateObject: thirdFriday,
          dte: Math.ceil((thirdFriday - today) / (1000 * 60 * 60 * 24))
        })
      }
    }
    
    return dates
  }

  // Helper: Calculate 3rd Friday of a given month
  getThirdFriday(year, month) {
    const firstDay = new Date(year, month, 1)
    const firstFriday = new Date(year, month, 1 + (5 - firstDay.getDay() + 7) % 7)
    return new Date(year, month, firstDay.getDate() + 14) // 3rd Friday
  }

  // Get multiple quotes efficiently
  async getMultipleQuotes(symbols) {
    const quotes = {}
    const errors = {}
    
    console.log(`🔄 Fetching quotes for ${symbols.length} symbols:`, symbols)
    
    // Process symbols one by one to respect rate limits
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i]
      try {
        if (i > 0) {
          // Add delay between requests (Alpha Vantage free tier allows 5 requests per minute)
          await new Promise(resolve => setTimeout(resolve, 12000)) // 12 second delay = 5 per minute
        }
        quotes[symbol] = await this.getQuote(symbol)
        console.log(`✅ Got quote for ${symbol}:`, quotes[symbol])
      } catch (error) {
        console.error(`❌ Failed to get quote for ${symbol}:`, error)
        errors[symbol] = error.message
      }
    }
    
    return { quotes, errors }
  }

  // Get company overview
  async getCompanyOverview(symbol) {
    try {
      const data = await this.makeRequest({
        function: 'OVERVIEW',
        symbol: symbol.toUpperCase()
      })
      
      if (!data.Symbol) {
        throw new Error(`No company data found for symbol ${symbol}`)
      }
      
      return {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description,
        sector: data.Sector,
        industry: data.Industry,
        marketCap: data.MarketCapitalization,
        peRatio: parseFloat(data.PERatio) || null,
        dividendYield: parseFloat(data.DividendYield) || null,
        beta: parseFloat(data.Beta) || null,
        eps: parseFloat(data.EPS) || null,
        bookValue: parseFloat(data.BookValue) || null
      }
    } catch (error) {
      console.error(`❌ Error fetching company overview for ${symbol}:`, error)
      throw error
    }
  }
}

// Export the class
export { AlphaVantageAPI }
export default AlphaVantageAPI