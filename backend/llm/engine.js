/**
 * Local LLM Engine — Dynamic SDLC Generation via Ollama
 * 
 * Replaces the rule-based templating engine with actual local LLM calls.
 * Implements robust JSON parsing and fallback mechanisms to ensure the pipeline never crashes.
 */

class LLMEngine {
  constructor() {
    this.OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/v1/chat/completions';
    this.MODEL = 'llama3.2';
    
    // Legacy properties for fallback templates
    this.techKeywords = {
      web: ['react', 'angular', 'vue', 'frontend', 'website', 'web app', 'ui', 'dashboard', 'portal'],
      mobile: ['mobile', 'ios', 'android', 'app', 'flutter', 'react native'],
      backend: ['api', 'server', 'backend', 'microservice', 'rest', 'graphql'],
      data: ['database', 'data', 'analytics', 'ml', 'ai', 'machine learning', 'big data'],
      cloud: ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'devops'],
      security: ['security', 'auth', 'encryption', 'compliance', 'gdpr'],
      ecommerce: ['ecommerce', 'shop', 'store', 'payment', 'cart', 'checkout'],
      social: ['social', 'chat', 'messaging', 'community', 'forum', 'collaboration'],
    };
    this.methodologies = { low: 'Kanban', medium: 'Agile (Scrum)', high: 'Scaled Agile Framework (SAFe)', epic: 'Hybrid Agile-Waterfall' };
    this.techStacks = {
      web: { frontend: 'React 18 + TypeScript', backend: 'Node.js + Express', database: 'PostgreSQL', cache: 'Redis' },
      mobile: { frontend: 'React Native', backend: 'Node.js + Fastify', database: 'MongoDB', cache: 'Redis' },
      data: { frontend: 'React + D3.js', backend: 'Python + FastAPI', database: 'PostgreSQL + TimescaleDB', cache: 'Apache Kafka' },
      ecommerce: { frontend: 'Next.js', backend: 'Node.js + Express', database: 'PostgreSQL', cache: 'Redis + Elasticsearch' },
      default: { frontend: 'React 18 + Vite', backend: 'Node.js + Express', database: 'PostgreSQL', cache: 'Redis' },
    };
  }

  /**
   * Main asynchronous entrypoint for pipeline agents.
   */
  async generate(agentType, projectData, previousOutputs = {}, retries = 2) {
    console.log(`[LLMEngine] Requesting generation for agent: ${agentType} using ${this.MODEL} (Retries left: ${retries})`);
    try {
      const messages = this._buildMessages(agentType, projectData, previousOutputs);
      
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.MODEL,
          messages: messages,
          stream: false,
          response_format: { type: 'json_object' },
          options: {
            num_predict: 4096,
            temperature: agentType === 'architect' ? 0.85 : 0.7, // Higher temp for more creative architecture
            top_p: 0.9,
            num_ctx: 8192
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.choices[0].message.content || '';
      
      try {
        const jsonOutput = this._extractJSON(rawText);
        
        // Basic validation: attach metadata if missing
        jsonOutput.agentVersion = `${agentType.charAt(0).toUpperCase() + agentType.slice(1)}Agent (${this.MODEL})`;
        jsonOutput.generatedAt = new Date().toISOString();
        if (!jsonOutput.title) jsonOutput.title = `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Output`;
        if (!jsonOutput.sections) jsonOutput.sections = {};
        
        console.log(`[LLMEngine] Successfully generated output for ${agentType} via Ollama.`);
        return jsonOutput;
      } catch (parseError) {
        if (retries > 0) {
          console.warn(`[LLMEngine] JSON parse failed for ${agentType}, retrying... Error: ${parseError.message}`);
          return this.generate(agentType, projectData, previousOutputs, retries - 1);
        }
        throw parseError;
      }

    } catch (error) {
      console.error(`[LLMEngine] Failed to generate for ${agentType} via Ollama. Falling back to dynamic templates. Error: ${error.message}`);
      return this._generateFallback(agentType, projectData, previousOutputs);
    }
  }

  _buildMessages(agentType, projectData, previousOutputs) {
    const categories = Object.entries(this.techKeywords)
      .filter(([cat, keywords]) => 
        keywords.some(k => (projectData.name + ' ' + projectData.problemStatement).toLowerCase().includes(k))
      )
      .map(([cat]) => cat.toUpperCase());
    const detectedDomain = categories.length > 0 ? categories.join(', ') : 'GENERAL SOFTWARE';

    switch (agentType) {
      case 'analyst':
        role = 'Business Analyst';
        schemaStr = `{ 
          "title": "Software Requirements Specification", 
          "sections": { 
            "smartGoals": { "specific": "", "measurable": "", "achievable": "", "relevant": "", "timeBound": "" }, 
            "functionalRequirements": [ 
              { "id": "FR-001", "description": "DETAILED_DESCRIPTION", "priority": "High", "category": "Core/UI/Data", "rationale": "WHY_THIS_IS_NEEDED" } 
            ], 
            "nonFunctionalRequirements": [ 
              { "id": "NFR-001", "description": "DETAILED_TECHNICAL_DESCRIPTION", "category": "Performance/Security/Scalability", "impact": "HOW_IT_AFFECTS_USER" } 
            ], 
            "userStories": [ 
              { "id": "US-001", "persona": "", "story": "", "acceptance": "DETAILED_ACCEPTANCE_CRITERIA", "points": 3 } 
            ], 
            "targetAudience": "DETAILED_USER_SEGMENTS", 
            "projectScope": "WHAT_IS_INCLUDED_AND_EXCLUDED" 
          } 
        }`;
        break;
      case 'strategist':
        role = 'Project Strategist & Scrum Master';
        schemaStr = `{ "title": "Project Strategy & Methodology Report", "sections": { "methodologySelection": { "chosen": "", "rationale": "", "sprintDuration": "", "totalSprints": 0 }, "roadmap": [ { "phase": "", "duration": "", "milestones": [""] } ], "featureShortlist": [ { "name": "", "priority": "", "effort": "" } ], "riskAssessment": [ { "risk": "", "probability": "", "mitigation": "" } ], "teamComposition": { "lead": "", "developers": 0, "qa": 0, "devops": 0, "designer": 0 } } }`;
        break;
      case 'architect':
        role = 'Systems Architect';
        schemaStr = `{ 
          "title": "System Architecture Document", 
          "sections": { 
            "techStackDecision": { 
              "frontend": "", 
              "backend": "", 
              "database": "", 
              "caching": "", 
              "containerization": "", 
              "orchestration": "", 
              "cicd": "", 
              "monitoring": "",
              "techStackRationale": "EXPLAIN_WHY_THIS_STACK_WAS_CHOSEN_FOR_THIS_SPECIFIC_PROBLEM"
            }, 
            "systemDesign": { "pattern": "", "communication": "", "authentication": "", "apiGateway": "" }, 
            "components": [ { "name": "", "description": "", "technology": "" } ], 
            "dataModel": { "entities": [ { "name": "", "fields": [""] } ], "relationships": [""] }, 
            "securityArchitecture": { "authentication": "", "authorization": "", "encryption": "", "compliance": "" } 
          } 
        }`;
        break;
      case 'qaqc':
        role = 'QA/QC Engineer';
        schemaStr = `{ "title": "Quality Assurance & Test Strategy", "sections": { "testCases": [ { "id": "TC-001", "module": "", "scenario": "", "expected": "", "type": "" } ], "testingStrategy": { "unitTesting": { "framework": "", "coverage": "", "approach": "" }, "integrationTesting": { "framework": "", "coverage": "", "approach": "" }, "e2eTesting": { "framework": "", "coverage": "", "approach": "" }, "performanceTesting": { "tool": "", "scenarios": [""] } }, "qaProcessGuidelines": [""], "defectManagement": { "severity": [""], "sla": { "P0": "", "P1": "", "P2": "", "P3": "" } } } }`;
        break;
      case 'devops':
        role = 'DevOps & ITIL Engineer';
        schemaStr = `{ "title": "DevOps & ITIL Management Plan", "sections": { "cicdPipeline": { "stages": [ { "name": "", "tools": "", "actions": [""] } ] }, "incidentManagement": { "flow": [""], "escalation": { "L1": "", "L2": "", "L3": "" } }, "changeManagement": { "process": [""], "types": [""] }, "deploymentStrategy": { "type": "", "rollback": "", "canary": "" }, "monitoring": { "infrastructure": "", "application": "", "alerting": "", "dashboards": [""] } } }`;
        break;
      case 'taskmaster':
        role = 'Technical Taskmaster / Delivery Manager';
        schemaStr = `{ "title": "Task Breakdown & Sprint Plan", "sections": { "taskBreakdown": [ { "key": "NX-001", "name": "", "agent": "", "status": "To Do", "priority": "High", "estimate": "5 pts" } ], "sprintPlan": [ { "sprint": 1, "goal": "", "tasks": ["NX-001"], "velocity": 0 } ], "roleAllocation": { "Role Name": ["Responsibility"] }, "timeline": { "start": "YYYY-MM-DD", "mvpDelivery": "YYYY-MM-DD", "finalDelivery": "YYYY-MM-DD" } } }`;
        break;
    }

    return [
      { 
        role: 'system', 
        content: `You are an elite ${role} with 20+ years of experience in high-scale software systems. 
        Your goal is to provide deep, exhaustive, and technically accurate deliverables. 
        You MUST output ONLY valid JSON matching the exact schema provided. 
        
        DETECTED DOMAIN: ${detectedDomain}
        
        CRITICAL CONSTRAINTS:
        1. FOR EACH ARRAY SECTION: Provide a MINIMUM of 10 items.
        2. Descriptions must be at least 2-3 sentences long.
        3. Do not use placeholders. Provide specific, real-world examples relevant to the project.
        4. Focus on edge cases and advanced technical details.
        
        AGENT-SPECIFIC GUIDANCE (${agentType.toUpperCase()}):
        ${agentType === 'architect' ? `
        - MANDATORY TECHNOLOGICAL DIVERSITY: You MUST NOT default to a "Standard MERN" stack (React/Node/Mongo). 
        - DOMAIN-SPECIFIC SELECTION: 
            * If the project involves AI/ML/Data: Use Python (FastAPI/Flask) + vector databases (Chroma/Pinecone).
            * If it involves High-Concurrency/Real-time: Use Go, Elixir, or Erlang.
            * If it involves Enterprise/Banking: Use Java (Spring Boot) or C# (.NET).
            * If it involves Low-Level/Embedded: Use Rust or C++.
        - MODERN INFRASTRUCTURE: Suggest modern deployment targets like AWS Lambda, Google Cloud Run, or specialized PaaS.
        - UNIQUE RATIONALE: You must provide a 3-sentence technical justification for every choice.` : ''}
        ${agentType === 'analyst' ? '- Focus on deep business logic and user-centric edge cases.' : ''}` 
      },
      { 
        role: 'user', 
        content: `Generate comprehensive ${agentType} deliverables for the following project:

PROJECT IDENTIFICATION:
- Name: ${projectData.name}
- Problem Statement: ${projectData.problemStatement}
- Target Audience: ${projectData.targetAudience}
- Complexity Level: ${projectData.complexity}

CONTEXT FROM PREVIOUS AGENTS:
${JSON.stringify(previousOutputs, null, 2)}

INSTRUCTIONS:
1. Analyze the project details and the context from previous stages.
2. Generate a detailed ${agentType} report that aligns with the established vision.
3. Ensure all fields in the JSON schema are filled with rich, descriptive content.
4. Your response must be a single JSON object.

REQUIRED JSON SCHEMA:
${schemaStr}` }
    ];
  }

  _extractJSON(text) {
    try {
      // First attempt: direct parse (if LLM returned pure JSON)
      return JSON.parse(text.trim());
    } catch (e) {
      // Second attempt: extract from markdown blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (err) {}
      }
      
      // Third attempt: find the first { and last }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        } catch (err) {}
      }
      
      throw new Error("Failed to extract valid JSON from LLM response");
    }
  }

  // ── Fallback Logic (Legacy Templates) ──

  analyzeProject(projectData) {
    const text = `${projectData.name} ${projectData.problemStatement} ${projectData.goals || ''}`.toLowerCase();
    const detectedDomains = [];
    const detectedKeywords = [];
    for (const [domain, keywords] of Object.entries(this.techKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          if (!detectedDomains.includes(domain)) detectedDomains.push(domain);
          detectedKeywords.push(keyword);
        }
      }
    }
    return {
      domains: detectedDomains.length > 0 ? detectedDomains : ['web'],
      keywords: detectedKeywords,
      primaryDomain: detectedDomains[0] || 'web',
      complexity: projectData.complexity || 'medium',
      audience: projectData.targetAudience || 'external_b2b',
    };
  }

  _generateFallback(agentType, projectData, previousOutputs) {
    const analysis = this.analyzeProject(projectData);
    const domain = analysis.primaryDomain;
    const name = projectData.name;

    switch (agentType) {
      case 'analyst':
        return {
          title: `SRS for ${name}`,
          agentVersion: 'AnalystAgent v2.1 (Dynamic Fallback)',
          sections: {
            smartGoals: { specific: `Deliver a robust ${domain} platform for ${name}`, measurable: '100% feature parity with requirements', achievable: 'Yes', relevant: 'High', timeBound: '8 weeks' },
            functionalRequirements: [ { id: 'FR-001', description: `Enable users to interact with ${name} core services`, priority: 'High', category: 'Core' }, { id: 'FR-002', description: 'User profile management', priority: 'Medium', category: 'User' } ],
            nonFunctionalRequirements: [ { id: 'NFR-001', description: 'Response time < 300ms', category: 'Performance' } ],
            userStories: [ { id: 'US-001', persona: 'Customer', story: `I want to use ${name} to solve my problems`, acceptance: 'Task completed', points: 5 } ],
            targetAudience: projectData.targetAudience || 'General Users',
            projectScope: `This project covers the full ${domain} development of ${name}.`
          },
          confidence: 0.95,
          generatedAt: new Date().toISOString(),
        };
      case 'strategist':
        return this.generateStrategistOutput(projectData, analysis, previousOutputs);
      case 'architect':
        return this.generateArchitectOutput(projectData, analysis, previousOutputs);
      case 'qaqc':
        return this.generateQAOutput(projectData, analysis, previousOutputs);
      case 'devops':
        return this.generateDevOpsOutput(projectData, analysis, previousOutputs);
      case 'taskmaster':
        return this.generateTaskmasterOutput(projectData, analysis, previousOutputs);
      default: throw new Error(`Unknown agent type: ${agentType}`);
    }
  }

  generateAnalystOutput(project, analysis) {
    return {
      title: 'Software Requirements Specification (Fallback)',
      agentVersion: 'AnalystAgent v2.1 (Fallback)',
      sections: {
        smartGoals: { specific: "Fallback specific goal", measurable: "Fallback measurable", achievable: "Yes", relevant: "Yes", timeBound: "4 weeks" },
        functionalRequirements: [ { id: 'FR-001', description: 'Core system functionality', priority: 'High', category: 'Core' } ],
        nonFunctionalRequirements: [ { id: 'NFR-001', description: 'System response time < 500ms', category: 'Performance' } ],
        userStories: [ { id: 'US-001', persona: 'User', story: 'Login to system', acceptance: 'Can login', points: 3 } ],
        targetAudience: 'General Users',
        projectScope: 'Full lifecycle scope'
      },
      confidence: 0.94,
      generatedAt: new Date().toISOString(),
    };
  }

  generateStrategistOutput(project, analysis, previousOutputs) {
    return {
      title: 'Project Strategy & Methodology Report (Fallback)',
      agentVersion: 'StrategistAgent v1.8 (Fallback)',
      sections: {
        methodologySelection: { chosen: 'Agile', rationale: 'Fallback strategy', sprintDuration: '2 weeks', totalSprints: 4 },
        roadmap: [ { phase: 'Discovery', duration: '1 week', milestones: ['Requirements'] } ],
        featureShortlist: [ { name: 'Authentication', priority: 'High', effort: 'Medium' } ],
        riskAssessment: [ { risk: 'Scope creep', probability: 'High', mitigation: 'Strict change control' } ],
        teamComposition: { lead: '1', developers: 3, qa: 1, devops: 1, designer: 1 },
      },
      confidence: 0.91,
      generatedAt: new Date().toISOString(),
    };
  }

  generateArchitectOutput(project, analysis, previousOutputs) {
    return {
      title: 'System Architecture Document (Fallback)',
      agentVersion: 'ArchitectAgent v3.0 (Fallback)',
      sections: {
        techStackDecision: { 
          frontend: project.name.includes('AI') ? 'Streamlit / Next.js' : 'React + Tailwind', 
          backend: project.name.includes('AI') ? 'FastAPI (Python)' : 'Node.js (Express)', 
          database: 'Project-specific DB (e.g., PostgreSQL/MongoDB)', 
          caching: 'Redis', 
          containerization: 'Docker', 
          orchestration: 'Kubernetes', 
          cicd: 'GitHub Actions', 
          monitoring: 'Prometheus/Grafana',
          techStackRationale: 'Baseline architecture generated due to model response complexity.'
        },
        systemDesign: { pattern: 'Microservices', communication: 'REST API', authentication: 'JWT', apiGateway: 'Express' },
        components: [ { name: 'API Gateway', description: 'Entry point', technology: 'Express' } ],
        dataModel: { entities: [ { name: 'User', fields: ['id', 'email'] } ], relationships: ['User -> Project'] },
        securityArchitecture: { authentication: 'JWT', authorization: 'RBAC', encryption: 'AES-256', compliance: 'SOC2' },
      },
      confidence: 0.88,
      generatedAt: new Date().toISOString(),
    };
  }

  generateQAOutput(project, analysis, previousOutputs) {
    return {
      title: 'Quality Assurance & Test Strategy (Fallback)',
      agentVersion: 'QAAgent v2.4 (Fallback)',
      sections: {
        testCases: [ { id: 'TC-001', module: 'Auth', scenario: 'Login valid', expected: '200 OK', type: 'Unit' } ],
        testingStrategy: { unitTesting: { framework: 'Jest', coverage: '80%', approach: 'Component' }, integrationTesting: { framework: 'Supertest', coverage: '70%', approach: 'API' }, e2eTesting: { framework: 'Cypress', coverage: '60%', approach: 'UI' }, performanceTesting: { tool: 'k6', scenarios: ['Load test'] } },
        qaProcessGuidelines: ['Code reviews', 'CI pipeline'],
        defectManagement: { severity: ['P0', 'P1'], sla: { P0: '4h', P1: '24h', P2: '7d', P3: 'Next Sprint' } },
      },
      confidence: 0.92,
      generatedAt: new Date().toISOString(),
    };
  }

  generateDevOpsOutput(project, analysis, previousOutputs) {
    return {
      title: 'DevOps & ITIL Management Plan (Fallback)',
      agentVersion: 'DevOpsAgent v2.0 (Fallback)',
      sections: {
        cicdPipeline: { stages: [ { name: 'Build', tools: 'Docker', actions: ['Compile'] } ] },
        incidentManagement: { flow: ['Detect', 'Resolve'], escalation: { L1: 'Support', L2: 'Eng', L3: 'Lead' } },
        changeManagement: { process: ['RFC', 'Review'], types: ['Standard', 'Emergency'] },
        deploymentStrategy: { type: 'Blue-Green', rollback: 'Auto', canary: 'Yes' },
        monitoring: { infrastructure: 'Prometheus', application: 'Pino', alerting: 'PagerDuty', dashboards: ['Health'] },
      },
      confidence: 0.90,
      generatedAt: new Date().toISOString(),
    };
  }

  generateTaskmasterOutput(project, analysis, previousOutputs) {
    return {
      title: 'Task Breakdown & Sprint Plan (Fallback)',
      agentVersion: 'TaskmasterAgent v1.5 (Fallback)',
      sections: {
        taskBreakdown: [ { key: 'NX-001', name: 'Setup repo', agent: 'DevOps', status: 'Done', priority: 'High', estimate: '3 pts' } ],
        sprintPlan: [ { sprint: 1, goal: 'Foundation', tasks: ['NX-001'], velocity: 3 } ],
        roleAllocation: { 'Developer': ['Code'] },
        timeline: { start: '2024-01-01', mvpDelivery: '2024-02-01', finalDelivery: '2024-03-01' },
      },
      confidence: 0.93,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new LLMEngine();
