import { GoogleGenerativeAI } from '@google/generative-ai';

class AgentOrchestrator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.agents = new Map();
    this.initializeAgents();
  }

  initializeAgents() {
    // Register all specialized agents
    this.agents.set('location', {
      name: 'Location Agent',
      purpose: 'Maps user input to geographic coordinates and identifies restaurant districts',
      prompt: 'You are a location expert. Given a location query, extract coordinates and identify key restaurant areas.'
    });

    this.agents.set('maps', {
      name: 'Google Maps Agent',
      purpose: 'Queries Google Places API and scrapes additional reviews/ratings',
      prompt: 'You are a Google Maps expert. Find restaurants using Places API and extract ratings, reviews, and business info.'
    });

    this.agents.set('website', {
      name: 'Restaurant Site Agent',
      purpose: 'Scrapes restaurant websites for menus, dietary info, and photos',
      prompt: 'You are a web scraping expert. Extract menu items, prices, dietary information, and food photos from restaurant websites.'
    });

    this.agents.set('review', {
      name: 'Review Agent',
      purpose: 'Aggregates ratings from multiple platforms',
      prompt: 'You are a review aggregation expert. Consolidate ratings and reviews from Google, Yelp, and TripAdvisor.'
    });

    this.agents.set('dietary', {
      name: 'Dietary Filter Agent',
      purpose: 'Extracts and matches dietary information',
      prompt: 'You are a dietary specialist. Identify allergen information, dietary restrictions (vegan, gluten-free, etc.), and suitable menu items.'
    });
  }

  async orchestrateSearch(searchQuery) {
    try {
      const systemPrompt = this.buildSystemPrompt(searchQuery);
      
      const response = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: systemPrompt
          }]
        }]
      });

      const responseText = response.response.text();
      return this.parseAgentResponse(responseText, searchQuery);
    } catch (error) {
      console.error('Agent orchestration error:', error);
      throw new Error('Failed to orchestrate agent search');
    }
  }

  buildSystemPrompt(searchQuery) {
    const { location, budget, dietary, rating } = searchQuery;
    
    return `You are the master orchestrator of specialized restaurant-finding agents. 
Your task is to coordinate the following agents to find the best restaurants for a user:

Search Criteria:
- Location: ${location}
- Budget: ${budget || 'Any'}
- Dietary Restrictions: ${dietary?.join(', ') || 'None'}
- Minimum Rating: ${rating || 'Any'}

Agent Team:
${Array.from(this.agents.values()).map(agent => `- ${agent.name}: ${agent.purpose}`).join('\n')}

Instructions:
1. Analyze the search criteria
2. Plan which agents should be activated and in what order
3. For each agent, specify:
   - Agent name
   - Specific task/instructions
   - Expected data to return
4. Describe how to combine results from all agents
5. Provide a final recommendation format

Format your response as a clear action plan with agent assignments and execution sequence.`;
  }

  parseAgentResponse(responseText, searchQuery) {
    // Parse the model's response to extract agent tasks and execution plan
    return {
      plan: responseText,
      searchQuery,
      timestamp: new Date().toISOString(),
      agents_activated: Array.from(this.agents.keys()),
      status: 'planned'
    };
  }

  async executeAgentTask(agentName, task) {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const prompt = `${agent.prompt}\n\nTask: ${task}`;
    
    const response = await this.model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: prompt
        }]
      }]
    });

    return {
      agent: agentName,
      task,
      result: response.response.text(),
      timestamp: new Date().toISOString()
    };
  }

  getAgentStatus() {
    return {
      total_agents: this.agents.size,
      agents: Array.from(this.agents.entries()).map(([key, value]) => ({
        id: key,
        name: value.name,
        purpose: value.purpose
      }))
    };
  }
}

export default AgentOrchestrator;
