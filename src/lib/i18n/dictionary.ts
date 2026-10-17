export type Lang = "en" | "hi";

export const serviceKeys = ["mutualFunds", "sip", "sif", "swp", "stp", "etf", "portfolioManagement", "nps", "bonds", "insurance"] as const;
export type ServiceKey = (typeof serviceKeys)[number];

export const goalKeys = ["childEducation", "retirement", "home", "travel", "wealthCreation", "other"] as const;
export type GoalKey = (typeof goalKeys)[number];

export interface ServiceItem {
  key: ServiceKey;
  title: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  description: string;
}

export interface ApproachStep {
  number: string;
  title: string;
  /** Optional: a step without supplied copy shows its title only. */
  description?: string;
}

export interface CalcFieldCopy {
  label: string;
  tip: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  a11y: {
    skipToContent: string;
    logoAlt: string;
    close: string;
    opensInNewTab: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    calculator: string;
    approach: string;
    contact: string;
    cta: string;
    menuLabel: string;
    closeMenu: string;
    languageLabel: string;
    primaryNavLabel: string;
    mobileNavLabel: string;
    homeLinkLabel: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    subheading: string;
    paragraph: string;
    primaryCta: string;
    secondaryCta: string;
    freeConsult: string;
    callNow: string;
    whatsappUs: string;
    visual: {
      ariaLabel: string;
      sipDiscipline: string;
      goalPlanning: string;
      portfolioJourney: string;
      longTermView: string;
      stages: [string, string, string];
    };
  };
  trust: {
    ariaLabel: string;
    amfi: string;
    arn: string;
    freeConsult: string;
    goalOriented: string;
    personalised: string;
  };
  services: {
    heading: string;
    subheading: string;
    learnMore: string;
    items: ServiceItem[];
    modal: {
      discuss: string;
      whatsapp: string;
      previous: string;
      next: string;
      dialogLabel: string;
    };
  };
  planning: {
    heading: string;
    items: BenefitItem[];
  };
  whyChooseUs: {
    heading: string;
    statement: string;
    items: BenefitItem[];
  };
  about: {
    heading: string;
    photoAlt: string;
    paragraphs: [string, string, string];
    timelineLabel: string;
    timeline: [string, string, string, string];
  };
  approach: {
    heading: string;
    description: string;
    steps: ApproachStep[];
    flowCaption: string;
    footerLine: string;
    stepLabel: string;
  };
  journey: {
    label: string;
    steps: [string, string, string, string, string];
  };
  calculator: {
    heading: string;
    subheading: string;
    tabsLabel: string;
    sipTab: string;
    swpTab: string;
    inputsHeading: string;
    resultsHeading: string;
    increase: string;
    decrease: string;
    rangeHint: string;
    rangeError: string;
    year: string;
    years: string;
    yearAxisLabel: string;
    crore: string;
    lakh: string;
    lakhCrore: string;
    viewBreakdown: string;
    hideBreakdown: string;
    chartHint: string;
    resultsSummarySip: string;
    resultsSummarySwp: string;
    sip: {
      monthlyInvestment: CalcFieldCopy;
      investmentDuration: CalcFieldCopy;
      expectedReturn: CalcFieldCopy;
      totalInvested: string;
      estimatedReturns: string;
      estimatedFutureValue: string;
      illustrativeNote: string;
      donutTitle: string;
      investedAmount: string;
      estimatedPortfolioValue: string;
      growthChartTitle: string;
      tableCaption: string;
    };
    swp: {
      initialInvestment: CalcFieldCopy;
      monthlyWithdrawal: CalcFieldCopy;
      expectedReturn: CalcFieldCopy;
      withdrawalDuration: CalcFieldCopy;
      totalWithdrawals: string;
      remainingCorpus: string;
      estimatedReturns: string;
      warning: string;
      depletedWarning: string;
      chartTitle: string;
      balance: string;
      cumulativeWithdrawals: string;
      tableCaption: string;
    };
    disclaimer: string;
  };
  goalPlanner: {
    eyebrow: string;
    heading: string;
    prompt: string;
    goalsLabel: string;
    goals: Record<GoalKey, string>;
    response: string;
    note: string;
    tryCalculator: string;
    discuss: string;
    messageTemplate: string;
    emptyHint: string;
  };
  cta: {
    heading: string;
    text: string;
    sipLine: string;
    freeConsult: string;
    primary: string;
    secondary: string;
  };
  questions: {
    items: [string, string, string];
    text: string;
  };
  contact: {
    heading: string;
    companyName: string;
    tagline: string;
    mobileLabel: string;
    emailLabel: string;
    websiteLabel: string;
    amfi: string;
    freeConsultTitle: string;
    freeConsultText: string;
    form: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      requirementLabel: string;
      requirementPlaceholder: string;
      requirementOptions: Record<ServiceKey | "general", string>;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successText: string;
      fallbackTitle: string;
      fallbackText: string;
      fallbackWhatsapp: string;
      fallbackEmail: string;
      fallbackWhatsappMessage: string;
      errorTitle: string;
      errorText: string;
      requiredNote: string;
      errors: {
        nameRequired: string;
        phoneRequired: string;
        phoneInvalid: string;
        emailRequired: string;
        emailInvalid: string;
        requirementRequired: string;
        messageRequired: string;
        fixErrors: string;
      };
    };
  };
  disclaimerSection: {
    heading: string;
    paragraphs: [string, string, string, string];
  };
  footer: {
    tagline: string;
    quickLinksHeading: string;
    servicesHeading: string;
    contactHeading: string;
    disclaimerLink: string;
    amfi: string;
    arn: string;
    rights: string;
    backToTop: string;
  };
  floating: {
    whatsappMessage: string;
    whatsappAria: string;
    whatsappTooltip: string;
    callAria: string;
    callLabel: string;
  };
}

export const en: Dictionary = {
  meta: {
    title: "Deolikar Mutual Funds and Investment Services | Financial Planner & Wealth Advisor",
    description:
      "Deolikar Mutual Funds and Investment Services helps individuals and families understand mutual funds, SIP, SWP, STP, SIF, NPS, insurance and bonds with simple, goal-oriented investment guidance.",
  },
  a11y: {
    skipToContent: "Skip to main content",
    logoAlt: "Deolikar Wealth Advisors — Mutual Funds, Real Estate, Insurance",
    close: "Close",
    opensInNewTab: "(opens in a new tab)",
  },
  nav: {
    home: "Home",
    about: "About Us",
    services: "Services",
    calculator: "Investment Calculator",
    approach: "Our Approach",
    contact: "Contact",
    cta: "Start Your Investment Journey",
    menuLabel: "Open menu",
    closeMenu: "Close menu",
    languageLabel: "Select language",
    primaryNavLabel: "Primary navigation",
    mobileNavLabel: "Mobile navigation",
    homeLinkLabel: "Deolikar Mutual Funds and Investment Services — Home",
  },
  hero: {
    eyebrow: "AMFI Registered Mutual Fund Distributor",
    headline: "Your Financial Planner and Wealth Advisor",
    headlineAccent: "Wealth Advisor",
    subheading:
      "Helping you make informed and disciplined investment decisions for your financial goals.",
    paragraph:
      "At Deolikar Mutual Funds and Investment Services, we help individuals and families understand investment options and plan their investments according to their financial goals, investment horizon and requirements.",
    primaryCta: "Start Your Investment Journey",
    secondaryCta: "Explore Our Services",
    freeConsult: "Call us to book your FREE consultation.",
    callNow: "Call Now",
    whatsappUs: "WhatsApp Us",
    visual: {
      ariaLabel:
        "Illustration of a financial planning journey: a growth curve with goal markers, moving from plan to invest to review.",
      sipDiscipline: "SIP Discipline",
      goalPlanning: "Goal Planning",
      portfolioJourney: "Portfolio Journey",
      longTermView: "Long-Term View",
      stages: ["Plan", "Invest", "Review"],
    },
  },
  trust: {
    ariaLabel: "Credentials and commitments",
    amfi: "AMFI Registered Mutual Fund Distributor",
    arn: "ARN: 289210",
    freeConsult: "First Consultation Free",
    goalOriented: "Goal-Oriented Financial Planning",
    personalised: "Personalised Service",
  },
  services: {
    heading: "Our Investment Products",
    subheading: "Simple guidance for different investment and financial planning needs.",
    learnMore: "Learn More",
    items: [
      {
        key: "mutualFunds",
        title: "Mutual Funds",
        description:
          "Diversified investment solutions professionally managed according to the investment objective of each scheme.",
      },
      {
        key: "sip",
        title: "SIP – Systematic Investment Plan",
        description:
          "Invest a fixed amount regularly in mutual funds and build a disciplined approach toward long-term financial goals.",
      },
      {
        key: "sif",
        title: "SIF – Specialized Investment Fund",
        description:
          "Specialized investment solutions offering eligible investors access to specific investment strategies, subject to applicable regulations and eligibility requirements.",
      },
      {
        key: "swp",
        title: "SWP – Systematic Withdrawal Plan",
        description:
          "A facility that enables investors to withdraw a predetermined amount from their mutual fund investments at regular intervals.",
      },
      {
        key: "stp",
        title: "STP – Systematic Transfer Plan",
        description:
          "A facility that allows investors to systematically transfer investments from one mutual fund scheme to another, subject to applicable scheme terms.",
      },
      {
        key: "etf",
        title: "ETF – Exchange Traded Funds",
        description:
          "Investment funds traded on stock exchanges that generally track an index, commodity, or other underlying asset.",
      },
      {
        key: "bonds",
        title: "Bonds",
        description:
          "Debt investment instruments that may provide interest income and diversification, subject to the issuer's terms and associated risks.",
      },
      {
        key: "nps",
        title: "NPS – National Pension System",
        description:
          "A long-term retirement-oriented investment option designed to help individuals build a retirement corpus.",
      },
      {
        key: "portfolioManagement",
        title: "PMS – Portfolio Management Services",
        description:
          "Professionally managed investment portfolios designed according to the investor's objectives and the applicable regulatory framework.",
      },
      {
        key: "insurance",
        title: "Insurance",
        description:
          "Protection solutions designed to help individuals and families manage specified financial risks and protect their financial security.",
      },
    ],
    modal: {
      discuss: "Discuss this with us",
      whatsapp: "WhatsApp Us",
      previous: "Previous service",
      next: "Next service",
      dialogLabel: "Service details",
    },
  },
  planning: {
    heading: "Our Financial Planning Services",
    items: [
      {
        title: "Financial Planning",
        description:
          "A structured process of understanding your financial position, goals, responsibilities, and investment requirements to create a suitable financial plan.",
      },
      {
        title: "Goal-Based Investment Planning",
        description:
          "Planning investments around specific financial goals such as children's education, home purchase, wealth creation, and retirement.",
      },
      {
        title: "Child Education & Future Planning",
        description:
          "Helping parents plan and invest systematically to build a corpus for their child's future education, professional courses, and other important financial milestones.",
      },
      {
        title: "SIP Planning",
        description:
          "Helping you plan your SIP investments according to your financial goals, investment horizon, risk profile, and investment capacity.",
      },
      {
        title: "Portfolio Review",
        description:
          "Reviewing your existing investments to understand their allocation, diversification, risks, and alignment with your financial goals.",
      },
      {
        title: "Retirement Planning",
        description:
          "Helping you plan for your future financial requirements and work toward building an adequate retirement corpus.",
      },
      {
        title: "Investment Guidance",
        description:
          "Helping you understand different investment options, their features, risks, costs, and suitability before making investment decisions.",
      },
      {
        title: "Investment Review & Monitoring",
        description:
          "Periodic review of your investments and financial goals to help keep your investment strategy aligned with your changing requirements.",
      },
      {
        title: "Wealth Creation Planning",
        description:
          "Developing a disciplined, long-term investment approach focused on building wealth through appropriate investment strategies and regular investing.",
      },
    ],
  },
  whyChooseUs: {
    heading: "Why Choose Us?",
    statement: "Simple guidance. Disciplined investing. Long-term thinking.",
    items: [
      {
        title: "Simple and easy-to-understand investment guidance",
        description: "We explain investment options in simple language.",
      },
      {
        title: "Goal-oriented financial planning",
        description: "Investment discussions are aligned with your financial goals and requirements.",
      },
      {
        title: "Assistance with Mutual Fund and SIP investments",
        description: "Support for understanding and investing in suitable options.",
      },
      {
        title: "Regular investment and portfolio review support",
        description: "Ongoing assistance and investment review support.",
      },
      {
        title: "Focus on disciplined, long-term investing",
        description: "Focus on consistency and long-term financial planning.",
      },
      {
        title: "Personalised service and easy communication",
        description: "Easy communication and personalised support.",
      },
    ],
  },
  about: {
    heading: "About Deolikar Mutual Funds",
    photoAlt: "Portrait photograph — Deolikar Mutual Funds and Investment Services",
    paragraphs: [
      "Deolikar Mutual Funds and Investment Services is focused on helping investors understand and organise their investments in a simple, transparent and disciplined manner.",
      "We believe that investing is not just about selecting an investment product. It is also about understanding your financial goals, investment horizon, risk profile and overall financial situation.",
      "Our approach is to understand your requirements, explain the available investment options in simple language, and help you make informed investment decisions.",
    ],
    timelineLabel: "Your financial journey",
    timeline: ["Goals", "Plan", "Invest", "Review"],
  },
  approach: {
    heading: "Our Approach",
    description:
      "We believe that successful investing starts with understanding your goals and creating a disciplined investment plan suited to your individual requirements.",
    steps: [
      {
        number: "01",
        title: "Understand",
        description: "We understand your financial requirements and goals.",
      },
      {
        number: "02",
        title: "Plan",
        description: "We discuss suitable investment options based on your requirements.",
      },
      {
        number: "03",
        title: "Invest",
        description: "We assist you through the investment process.",
      },
      {
        number: "04",
        title: "Review",
        description: "We provide ongoing support and review.",
      },
      {
        number: "05",
        title: "Progress",
      },
    ],
    flowCaption: "Understand → Plan → Invest → Review → Progress",
    footerLine: "Your goals. Your requirements. Your financial journey.",
    stepLabel: "Step",
  },
  journey: {
    label: "Your Financial Journey",
    steps: ["Goal", "Understand", "Plan", "Invest", "Review"],
  },
  calculator: {
    heading: "Investment Calculator",
    subheading: "See illustrative estimates based on the assumptions you enter.",
    tabsLabel: "Choose a calculator",
    sipTab: "SIP Calculator",
    swpTab: "SWP Calculator",
    inputsHeading: "Your Inputs",
    resultsHeading: "Estimated Results",
    increase: "Increase",
    decrease: "Decrease",
    rangeHint: "Allowed range: {min} to {max}",
    rangeError: "Please enter a value between {min} and {max}.",
    year: "Year",
    years: "Years",
    yearAxisLabel: "Years",
    crore: "Crore",
    lakh: "Lakh",
    lakhCrore: "Lakh Crore",
    viewBreakdown: "View year-by-year breakdown",
    hideBreakdown: "Hide year-by-year breakdown",
    chartHint: "Hover or use the arrow keys to explore each year.",
    resultsSummarySip:
      "For a monthly investment of {amount} over {years} years, total invested is {invested}, estimated returns are {returns} and estimated future value is {value}.",
    resultsSummarySwp:
      "Starting with {initial} and withdrawing {amount} monthly for {years} years, total withdrawals are {withdrawn}, estimated returns are {returns} and estimated remaining corpus is {remaining}.",
    sip: {
      monthlyInvestment: {
        label: "Monthly Investment",
        tip: "The amount you plan to invest every month.",
      },
      investmentDuration: {
        label: "Investment Duration",
        tip: "The number of years you plan to keep investing.",
      },
      expectedReturn: {
        label: "Expected Annual Return",
        tip: "An assumed yearly return used only for this illustration. Actual returns are market-linked and may vary.",
      },
      totalInvested: "Total Invested Amount",
      estimatedReturns: "Estimated Returns",
      estimatedFutureValue: "Estimated Future Value",
      illustrativeNote: "Illustrative return assumption only. Actual returns are market-linked and may vary.",
      donutTitle: "Invested Amount vs Estimated Returns",
      investedAmount: "Invested Amount",
      estimatedPortfolioValue: "Estimated Portfolio Value",
      growthChartTitle: "Estimated Portfolio Growth Over Time",
      tableCaption: "Year-by-year invested amount and estimated portfolio value",
    },
    swp: {
      initialInvestment: {
        label: "Initial Investment",
        tip: "The lump-sum amount invested at the start.",
      },
      monthlyWithdrawal: {
        label: "Monthly Withdrawal",
        tip: "The fixed amount you plan to withdraw every month.",
      },
      expectedReturn: {
        label: "Expected Annual Return",
        tip: "An assumed yearly return used only for this illustration. Actual returns are market-linked and may vary.",
      },
      withdrawalDuration: {
        label: "Withdrawal Duration",
        tip: "The number of years over which you plan to make withdrawals.",
      },
      totalWithdrawals: "Total Withdrawals",
      remainingCorpus: "Estimated Remaining Corpus",
      estimatedReturns: "Estimated Returns",
      warning:
        "SWP calculations are illustrative only. Actual outcomes depend on market performance, withdrawal amount, timing and applicable investment scheme terms.",
      depletedWarning:
        "At these inputs, the estimated corpus may be exhausted before the end of the chosen duration.",
      chartTitle: "Portfolio Balance Over Time",
      balance: "Portfolio Balance",
      cumulativeWithdrawals: "Total Withdrawals",
      tableCaption: "Year-by-year portfolio balance and total withdrawals",
    },
    disclaimer:
      "Investment calculator results are illustrative and based on the assumptions entered by the user. They do not represent guaranteed returns or actual future performance. Mutual fund investments are subject to market risks.",
  },
  goalPlanner: {
    eyebrow: "Goal Planning",
    heading: "What are you planning for?",
    prompt: "Select a goal to begin.",
    goalsLabel: "Financial goals",
    goals: {
      childEducation: "Child Education",
      retirement: "Retirement",
      home: "Home",
      travel: "Travel",
      wealthCreation: "Wealth Creation",
      other: "Other",
    },
    response: "Let's understand your investment requirement.",
    note: "Goal selection is only a starting point for a conversation. It is not an investment recommendation.",
    tryCalculator: "Try the Investment Calculator",
    discuss: "Discuss this goal with us",
    messageTemplate: "I would like to discuss my goal: {goal}.",
    emptyHint: "Choose one of the goals above",
  },
  cta: {
    heading: "Start Your Investment Journey",
    text: "You don't need to wait for a large amount of money to start investing. A disciplined approach and regular investing can help you work towards your long-term financial goals.",
    sipLine: "Start Your Journey to Becoming a Millionaire.",
    freeConsult: "Call us to book your FREE consultation.",
    primary: "Let's Plan Your Financial Journey",
    secondary: "WhatsApp Us",
  },
  questions: {
    items: [
      "Looking to start a SIP?",
      "Want to understand Mutual Funds better?",
      "Planning for your long-term financial goals?",
    ],
    text: "Connect with us to discuss your investment requirements and explore suitable options.",
  },
  contact: {
    heading: "Contact Us",
    companyName: "DEOLIKAR MUTUAL FUNDS AND INVESTMENT SERVICES",
    tagline: "Your Financial Planner and Wealth Advisor",
    mobileLabel: "Mobile / WhatsApp",
    emailLabel: "Email",
    websiteLabel: "Website",
    amfi: "AMFI Registered Mutual Fund Distributor",
    freeConsultTitle: "First Consultation Free",
    freeConsultText: "Let's discuss your financial goals and investment requirements.",
    form: {
      title: "Request a Consultation",
      nameLabel: "Name",
      namePlaceholder: "Your full name",
      phoneLabel: "Phone Number",
      phonePlaceholder: "10-digit mobile number",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      requirementLabel: "Investment Requirement",
      requirementPlaceholder: "Select an option",
      requirementOptions: {
        mutualFunds: "Mutual Funds",
        sip: "SIP",
        sif: "SIF",
        swp: "SWP",
        stp: "STP",
        etf: "ETF",
        portfolioManagement: "Portfolio Management",
        nps: "NPS",
        bonds: "Bonds",
        insurance: "Insurance",
        general: "General Enquiry",
      },
      messageLabel: "Message",
      messagePlaceholder: "Tell us a little about your requirement",
      submit: "Request a Consultation",
      submitting: "Sending...",
      successTitle: "Thank you",
      successText: "Your request has been received. We will get in touch with you shortly.",
      fallbackTitle: "One more step",
      fallbackText:
        "We could not send your request automatically. Please send your details to us on WhatsApp or by email and we will get back to you.",
      fallbackWhatsapp: "Send on WhatsApp",
      fallbackEmail: "Send by email",
      fallbackWhatsappMessage:
        "Hello, I would like to request a consultation with Deolikar Mutual Funds and Investment Services.",
      errorTitle: "Something went wrong",
      errorText: "We could not send your request right now. Please try again or reach us on WhatsApp.",
      requiredNote: "All fields are required.",
      errors: {
        nameRequired: "Please enter your name.",
        phoneRequired: "Please enter your phone number.",
        phoneInvalid: "Please enter a valid 10-digit mobile number.",
        emailRequired: "Please enter your email address.",
        emailInvalid: "Please enter a valid email address.",
        requirementRequired: "Please select an investment requirement.",
        messageRequired: "Please add a short message.",
        fixErrors: "Please correct the highlighted fields.",
      },
    },
  },
  disclaimerSection: {
    heading: "Important Disclaimer",
    paragraphs: [
      "Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.",
      "Past performance is not indicative of future returns.",
      "Investment decisions should be made after considering your investment objectives, risk appetite, investment horizon and financial circumstances.",
      "The information provided on this website is for general informational and educational purposes and should not be construed as a guarantee of returns or as a substitute for personalised financial advice.",
    ],
  },
  footer: {
    tagline: "Your Financial Planner and Wealth Advisor",
    quickLinksHeading: "Quick Links",
    servicesHeading: "Services",
    contactHeading: "Contact",
    disclaimerLink: "Important Disclaimer",
    amfi: "AMFI Registered Mutual Fund Distributor",
    arn: "ARN: 289210",
    rights: "© Deolikar Mutual Funds and Investment Services. All Rights Reserved.",
    backToTop: "Back to top",
  },
  floating: {
    whatsappMessage:
      "Hello, I would like to discuss my investment requirements with Deolikar Mutual Funds and Investment Services.",
    whatsappAria: "Chat with us on WhatsApp",
    whatsappTooltip: "Chat on WhatsApp",
    callAria: "Call Deolikar Mutual Funds and Investment Services on 90755 45105",
    callLabel: "Call 90755 45105",
  },
};

export const hi: Dictionary = {
  meta: {
    title: "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज | फाइनेंशियल प्लानर एवं वेल्थ एडवाइजर",
    description:
      "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज, व्यक्तियों और परिवारों को म्यूचुअल फंड, SIP, SWP, STP, SIF, NPS, बीमा और बॉन्ड्स को समझने में सरल एवं लक्ष्य-आधारित निवेश मार्गदर्शन प्रदान करती है।",
  },
  a11y: {
    skipToContent: "मुख्य सामग्री पर जाएं",
    logoAlt: "देओलीकर वेल्थ एडवाइजर्स — म्यूचुअल फंड्स, रियल एस्टेट, बीमा",
    close: "बंद करें",
    opensInNewTab: "(नए टैब में खुलता है)",
  },
  nav: {
    home: "होम",
    about: "हमारे बारे में",
    services: "सेवाएं",
    calculator: "निवेश कैलकुलेटर",
    approach: "हमारा दृष्टिकोण",
    contact: "संपर्क करें",
    cta: "अपनी निवेश यात्रा शुरू करें",
    menuLabel: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    languageLabel: "भाषा चुनें",
    primaryNavLabel: "मुख्य नेविगेशन",
    mobileNavLabel: "मोबाइल नेविगेशन",
    homeLinkLabel: "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज — होम",
  },
  hero: {
    eyebrow: "AMFI पंजीकृत म्यूचुअल फंड वितरक",
    headline: "आपके वित्तीय नियोजक और वेल्थ एडवाइजर",
    headlineAccent: "वेल्थ एडवाइजर",
    subheading: "आपके वित्तीय लक्ष्यों के लिए सोच-समझकर और अनुशासित निवेश निर्णय लेने में आपकी मदद करना।",
    paragraph:
      "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज में, हम व्यक्तियों और परिवारों को निवेश विकल्पों को समझने और उनके वित्तीय लक्ष्यों, निवेश अवधि तथा आवश्यकताओं के अनुसार अपने निवेश की योजना बनाने में मदद करते हैं।",
    primaryCta: "अपनी निवेश यात्रा शुरू करें",
    secondaryCta: "हमारी सेवाएं देखें",
    freeConsult: "अपना निःशुल्क परामर्श बुक करने के लिए हमें कॉल करें।",
    callNow: "अभी कॉल करें",
    whatsappUs: "व्हाट्सएप करें",
    visual: {
      ariaLabel:
        "वित्तीय नियोजन यात्रा का चित्रण: लक्ष्य-चिह्नों के साथ एक विकास वक्र, जो योजना से निवेश और फिर समीक्षा की ओर बढ़ता है।",
      sipDiscipline: "SIP अनुशासन",
      goalPlanning: "लक्ष्य नियोजन",
      portfolioJourney: "पोर्टफोलियो यात्रा",
      longTermView: "दीर्घकालिक दृष्टिकोण",
      stages: ["योजना", "निवेश", "समीक्षा"],
    },
  },
  trust: {
    ariaLabel: "प्रमाण और प्रतिबद्धताएं",
    amfi: "AMFI पंजीकृत म्यूचुअल फंड वितरक",
    arn: "ARN: 289210",
    freeConsult: "पहला परामर्श निःशुल्क",
    goalOriented: "लक्ष्य-आधारित वित्तीय नियोजन",
    personalised: "व्यक्तिगत सेवा",
  },
  services: {
    heading: "हमारे निवेश उत्पाद",
    subheading: "विभिन्न निवेश और वित्तीय नियोजन आवश्यकताओं के लिए सरल मार्गदर्शन।",
    learnMore: "और जानें",
    items: [
      {
        key: "mutualFunds",
        title: "म्यूचुअल फंड्स",
        description:
          "प्रत्येक योजना के निवेश उद्देश्य के अनुसार पेशेवर रूप से प्रबंधित विविधीकृत निवेश समाधान।",
      },
      {
        key: "sip",
        title: "SIP – सिस्टमैटिक इन्वेस्टमेंट प्लान",
        description:
          "म्यूचुअल फंड में नियमित रूप से एक निश्चित राशि निवेश करें और दीर्घकालिक वित्तीय लक्ष्यों की ओर एक अनुशासित दृष्टिकोण विकसित करें।",
      },
      {
        key: "sif",
        title: "SIF – स्पेशलाइज्ड इन्वेस्टमेंट फंड",
        description:
          "विशिष्ट निवेश समाधान, जो लागू नियमों और पात्रता शर्तों के अधीन, पात्र निवेशकों को विशिष्ट निवेश रणनीतियों तक पहुंच प्रदान करते हैं।",
      },
      {
        key: "swp",
        title: "SWP – सिस्टमैटिक विड्रॉल प्लान",
        description:
          "एक सुविधा, जो निवेशकों को नियमित अंतराल पर अपने म्यूचुअल फंड निवेश से एक पूर्व-निर्धारित राशि निकालने में सक्षम बनाती है।",
      },
      {
        key: "stp",
        title: "STP – सिस्टमैटिक ट्रांसफर प्लान",
        description:
          "एक सुविधा, जो निवेशकों को लागू योजना शर्तों के अधीन, एक म्यूचुअल फंड योजना से दूसरी योजना में व्यवस्थित रूप से निवेश स्थानांतरित करने की अनुमति देती है।",
      },
      {
        key: "etf",
        title: "ETF – एक्सचेंज ट्रेडेड फंड्स",
        description:
          "स्टॉक एक्सचेंज पर ट्रेड होने वाले निवेश फंड, जो सामान्यतः किसी सूचकांक, कमोडिटी या अन्य अंतर्निहित परिसंपत्ति को ट्रैक करते हैं।",
      },
      {
        key: "bonds",
        title: "बॉन्ड्स",
        description:
          "ऋण निवेश साधन, जो जारीकर्ता की शर्तों और संबंधित जोखिमों के अधीन, ब्याज आय और विविधीकरण प्रदान कर सकते हैं।",
      },
      {
        key: "nps",
        title: "NPS – नेशनल पेंशन सिस्टम",
        description:
          "एक दीर्घकालिक, सेवानिवृत्ति-केंद्रित निवेश विकल्प, जो व्यक्तियों को सेवानिवृत्ति कोष बनाने में मदद करने के लिए तैयार किया गया है।",
      },
      {
        key: "portfolioManagement",
        title: "PMS – पोर्टफोलियो मैनेजमेंट सर्विसेज",
        description:
          "निवेशक के उद्देश्यों और लागू नियामक ढांचे के अनुसार तैयार किए गए, पेशेवर रूप से प्रबंधित निवेश पोर्टफोलियो।",
      },
      {
        key: "insurance",
        title: "बीमा",
        description:
          "सुरक्षा समाधान, जो व्यक्तियों और परिवारों को निर्दिष्ट वित्तीय जोखिमों का प्रबंधन करने और उनकी वित्तीय सुरक्षा बनाए रखने में मदद करने के लिए तैयार किए गए हैं।",
      },
    ],
    modal: {
      discuss: "हमसे इस बारे में बात करें",
      whatsapp: "व्हाट्सएप करें",
      previous: "पिछली सेवा",
      next: "अगली सेवा",
      dialogLabel: "सेवा का विवरण",
    },
  },
  planning: {
    heading: "हमारी वित्तीय नियोजन सेवाएं",
    items: [
      {
        title: "वित्तीय नियोजन",
        description:
          "आपकी वित्तीय स्थिति, लक्ष्यों, जिम्मेदारियों और निवेश आवश्यकताओं को समझकर एक उपयुक्त वित्तीय योजना बनाने की एक व्यवस्थित प्रक्रिया।",
      },
      {
        title: "लक्ष्य-आधारित निवेश योजना",
        description:
          "बच्चों की शिक्षा, घर की खरीद, संपत्ति निर्माण और सेवानिवृत्ति जैसे विशिष्ट वित्तीय लक्ष्यों के अनुसार निवेश की योजना बनाना।",
      },
      {
        title: "बच्चों की शिक्षा एवं भविष्य योजना",
        description:
          "माता-पिता को अपने बच्चे की भविष्य की शिक्षा, व्यावसायिक पाठ्यक्रमों और अन्य महत्वपूर्ण वित्तीय पड़ावों के लिए कोष बनाने हेतु व्यवस्थित रूप से योजना बनाने और निवेश करने में मदद।",
      },
      {
        title: "SIP योजना",
        description:
          "आपके वित्तीय लक्ष्यों, निवेश अवधि, जोखिम प्रोफ़ाइल और निवेश क्षमता के अनुसार आपके SIP निवेश की योजना बनाने में मदद।",
      },
      {
        title: "पोर्टफोलियो समीक्षा",
        description:
          "आपके मौजूदा निवेशों के आवंटन, विविधीकरण, जोखिमों और आपके वित्तीय लक्ष्यों के साथ उनके तालमेल को समझने के लिए उनकी समीक्षा।",
      },
      {
        title: "सेवानिवृत्ति योजना",
        description:
          "आपकी भविष्य की वित्तीय आवश्यकताओं की योजना बनाने और पर्याप्त सेवानिवृत्ति कोष बनाने की दिशा में काम करने में मदद।",
      },
      {
        title: "निवेश मार्गदर्शन",
        description:
          "निवेश निर्णय लेने से पहले विभिन्न निवेश विकल्पों, उनकी विशेषताओं, जोखिमों, लागतों और उपयुक्तता को समझने में मदद।",
      },
      {
        title: "निवेश समीक्षा एवं निगरानी",
        description:
          "आपकी बदलती आवश्यकताओं के अनुरूप आपकी निवेश रणनीति बनाए रखने में मदद के लिए आपके निवेशों और वित्तीय लक्ष्यों की आवधिक समीक्षा।",
      },
      {
        title: "संपत्ति निर्माण योजना",
        description:
          "उपयुक्त निवेश रणनीतियों और नियमित निवेश के माध्यम से संपत्ति निर्माण पर केंद्रित, एक अनुशासित और दीर्घकालिक निवेश दृष्टिकोण विकसित करना।",
      },
    ],
  },
  whyChooseUs: {
    heading: "हमें क्यों चुनें?",
    statement: "सरल मार्गदर्शन। अनुशासित निवेश। दीर्घकालिक सोच।",
    items: [
      {
        title: "सरल और आसानी से समझ में आने वाला निवेश मार्गदर्शन",
        description: "हम निवेश विकल्पों को सरल भाषा में समझाते हैं।",
      },
      {
        title: "लक्ष्य-आधारित वित्तीय नियोजन",
        description: "निवेश संबंधी चर्चा आपके वित्तीय लक्ष्यों और आवश्यकताओं के अनुरूप होती है।",
      },
      {
        title: "म्यूचुअल फंड और SIP निवेश में सहायता",
        description: "उपयुक्त विकल्पों को समझने और उनमें निवेश करने के लिए सहायता।",
      },
      {
        title: "नियमित निवेश और पोर्टफोलियो समीक्षा सहायता",
        description: "निरंतर सहायता और निवेश समीक्षा सहयोग।",
      },
      {
        title: "अनुशासित, दीर्घकालिक निवेश पर ध्यान",
        description: "निरंतरता और दीर्घकालिक वित्तीय योजना पर ध्यान।",
      },
      {
        title: "व्यक्तिगत सेवा और सहज संवाद",
        description: "सहज संवाद और व्यक्तिगत सहायता।",
      },
    ],
  },
  about: {
    heading: "देओलीकर म्यूचुअल फंड्स के बारे में",
    photoAlt: "पोर्ट्रेट फ़ोटो — देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज",
    paragraphs: [
      "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज का उद्देश्य निवेशकों को उनके निवेश को सरल, पारदर्शी और अनुशासित तरीके से समझने और व्यवस्थित करने में मदद करना है।",
      "हमारा मानना है कि निवेश केवल एक निवेश उत्पाद चुनने तक सीमित नहीं है। यह आपके वित्तीय लक्ष्यों, निवेश अवधि, जोखिम प्रोफ़ाइल और समग्र वित्तीय स्थिति को समझने के बारे में भी है।",
      "हमारा दृष्टिकोण है — आपकी आवश्यकताओं को समझना, उपलब्ध निवेश विकल्पों को सरल भाषा में समझाना, और आपको सोच-समझकर निवेश निर्णय लेने में मदद करना।",
    ],
    timelineLabel: "आपकी वित्तीय यात्रा",
    timeline: ["लक्ष्य", "योजना", "निवेश", "समीक्षा"],
  },
  approach: {
    heading: "हमारा दृष्टिकोण",
    description:
      "हमारा मानना है कि सफल निवेश की शुरुआत आपके लक्ष्यों को समझने और आपकी व्यक्तिगत आवश्यकताओं के अनुरूप एक अनुशासित निवेश योजना बनाने से होती है।",
    steps: [
      {
        number: "01",
        title: "समझना",
        description: "हम आपकी वित्तीय आवश्यकताओं और लक्ष्यों को समझते हैं।",
      },
      {
        number: "02",
        title: "योजना",
        description: "हम आपकी आवश्यकताओं के आधार पर उपयुक्त निवेश विकल्पों पर चर्चा करते हैं।",
      },
      {
        number: "03",
        title: "निवेश",
        description: "हम निवेश प्रक्रिया में आपकी सहायता करते हैं।",
      },
      {
        number: "04",
        title: "समीक्षा",
        description: "हम निरंतर सहायता और समीक्षा प्रदान करते हैं।",
      },
      {
        number: "05",
        title: "प्रगति",
      },
    ],
    flowCaption: "समझना → योजना → निवेश → समीक्षा → प्रगति",
    footerLine: "आपके लक्ष्य। आपकी आवश्यकताएं। आपकी वित्तीय यात्रा।",
    stepLabel: "चरण",
  },
  journey: {
    label: "आपकी वित्तीय यात्रा",
    steps: ["लक्ष्य", "समझना", "योजना", "निवेश", "समीक्षा"],
  },
  calculator: {
    heading: "निवेश कैलकुलेटर",
    subheading: "आपके द्वारा दर्ज की गई धारणाओं के आधार पर उदाहरणात्मक अनुमान देखें।",
    tabsLabel: "कैलकुलेटर चुनें",
    sipTab: "SIP कैलकुलेटर",
    swpTab: "SWP कैलकुलेटर",
    inputsHeading: "आपके इनपुट",
    resultsHeading: "अनुमानित परिणाम",
    increase: "बढ़ाएं",
    decrease: "घटाएं",
    rangeHint: "मान्य सीमा: {min} से {max}",
    rangeError: "कृपया {min} से {max} के बीच का मान दर्ज करें।",
    year: "वर्ष",
    years: "वर्ष",
    yearAxisLabel: "वर्ष",
    crore: "करोड़",
    lakh: "लाख",
    lakhCrore: "लाख करोड़",
    viewBreakdown: "वर्ष-दर-वर्ष विवरण देखें",
    hideBreakdown: "वर्ष-दर-वर्ष विवरण छिपाएं",
    chartHint: "हर वर्ष का मान देखने के लिए कर्सर ले जाएं या तीर वाली कुंजियों का उपयोग करें।",
    resultsSummarySip:
      "{years} वर्षों के लिए {amount} के मासिक निवेश पर कुल निवेश {invested}, अनुमानित रिटर्न {returns} और अनुमानित भविष्य मूल्य {value} है।",
    resultsSummarySwp:
      "{initial} के प्रारंभिक निवेश से {years} वर्षों तक हर माह {amount} निकालने पर कुल विड्रॉल {withdrawn}, अनुमानित रिटर्न {returns} और अनुमानित शेष कोष {remaining} है।",
    sip: {
      monthlyInvestment: {
        label: "मासिक निवेश",
        tip: "वह राशि जो आप हर महीने निवेश करने की योजना बना रहे हैं।",
      },
      investmentDuration: {
        label: "निवेश अवधि",
        tip: "कितने वर्षों तक आप निवेश जारी रखने की योजना बना रहे हैं।",
      },
      expectedReturn: {
        label: "अपेक्षित वार्षिक रिटर्न",
        tip: "केवल इस उदाहरण के लिए मानी गई वार्षिक रिटर्न दर। वास्तविक रिटर्न बाजार से जुड़े होते हैं और इनमें बदलाव हो सकता है।",
      },
      totalInvested: "कुल निवेशित राशि",
      estimatedReturns: "अनुमानित रिटर्न",
      estimatedFutureValue: "अनुमानित भविष्य मूल्य",
      illustrativeNote:
        "यह केवल एक उदाहरणात्मक रिटर्न धारणा है। वास्तविक रिटर्न बाजार से जुड़े होते हैं और इनमें बदलाव हो सकता है।",
      donutTitle: "निवेशित राशि बनाम अनुमानित रिटर्न",
      investedAmount: "निवेशित राशि",
      estimatedPortfolioValue: "अनुमानित पोर्टफोलियो मूल्य",
      growthChartTitle: "समय के साथ अनुमानित पोर्टफोलियो वृद्धि",
      tableCaption: "वर्ष-दर-वर्ष निवेशित राशि और अनुमानित पोर्टफोलियो मूल्य",
    },
    swp: {
      initialInvestment: {
        label: "प्रारंभिक निवेश",
        tip: "शुरुआत में एकमुश्त निवेश की गई राशि।",
      },
      monthlyWithdrawal: {
        label: "मासिक विड्रॉल",
        tip: "वह निश्चित राशि जो आप हर महीने निकालने की योजना बना रहे हैं।",
      },
      expectedReturn: {
        label: "अपेक्षित वार्षिक रिटर्न",
        tip: "केवल इस उदाहरण के लिए मानी गई वार्षिक रिटर्न दर। वास्तविक रिटर्न बाजार से जुड़े होते हैं और इनमें बदलाव हो सकता है।",
      },
      withdrawalDuration: {
        label: "विड्रॉल अवधि",
        tip: "कितने वर्षों तक आप विड्रॉल करने की योजना बना रहे हैं।",
      },
      totalWithdrawals: "कुल विड्रॉल",
      remainingCorpus: "अनुमानित शेष कोष",
      estimatedReturns: "अनुमानित रिटर्न",
      warning:
        "SWP गणनाएं केवल उदाहरणात्मक हैं। वास्तविक परिणाम बाजार के प्रदर्शन, विड्रॉल राशि, समय और लागू निवेश योजना की शर्तों पर निर्भर करते हैं।",
      depletedWarning: "इन इनपुट्स पर, चुनी गई अवधि समाप्त होने से पहले अनुमानित कोष समाप्त हो सकता है।",
      chartTitle: "समय के साथ पोर्टफोलियो शेष राशि",
      balance: "पोर्टफोलियो शेष राशि",
      cumulativeWithdrawals: "कुल विड्रॉल",
      tableCaption: "वर्ष-दर-वर्ष पोर्टफोलियो शेष राशि और कुल विड्रॉल",
    },
    disclaimer:
      "निवेश कैलकुलेटर के परिणाम उपयोगकर्ता द्वारा दर्ज की गई धारणाओं पर आधारित केवल उदाहरणात्मक अनुमान हैं। ये गारंटीड रिटर्न या भविष्य के वास्तविक प्रदर्शन का प्रतिनिधित्व नहीं करते। म्यूचुअल फंड निवेश बाजार जोखिम के अधीन हैं।",
  },
  goalPlanner: {
    eyebrow: "लक्ष्य नियोजन",
    heading: "आप किसके लिए योजना बना रहे हैं?",
    prompt: "शुरू करने के लिए एक लक्ष्य चुनें।",
    goalsLabel: "वित्तीय लक्ष्य",
    goals: {
      childEducation: "बच्चों की शिक्षा",
      retirement: "सेवानिवृत्ति",
      home: "घर",
      travel: "यात्रा",
      wealthCreation: "संपत्ति निर्माण",
      other: "अन्य",
    },
    response: "आइए आपकी निवेश आवश्यकता को समझें।",
    note: "लक्ष्य का चयन केवल बातचीत की शुरुआत है। यह कोई निवेश सुझाव नहीं है।",
    tryCalculator: "निवेश कैलकुलेटर आज़माएं",
    discuss: "इस लक्ष्य पर हमसे चर्चा करें",
    messageTemplate: "मैं अपने लक्ष्य पर चर्चा करना चाहता/चाहती हूं: {goal}।",
    emptyHint: "ऊपर दिए गए लक्ष्यों में से एक चुनें",
  },
  cta: {
    heading: "अपनी निवेश यात्रा शुरू करें",
    text: "निवेश शुरू करने के लिए आपको बड़ी रकम का इंतज़ार करने की आवश्यकता नहीं है। अनुशासित दृष्टिकोण और नियमित निवेश आपको अपने दीर्घकालिक वित्तीय लक्ष्यों की दिशा में आगे बढ़ने में मदद कर सकते हैं।",
    sipLine: "मिलियनेयर बनने की अपनी यात्रा शुरू करें।",
    freeConsult: "अपना निःशुल्क परामर्श बुक करने के लिए हमें कॉल करें।",
    primary: "आइए आपकी वित्तीय यात्रा की योजना बनाएं",
    secondary: "व्हाट्सएप करें",
  },
  questions: {
    items: [
      "SIP शुरू करना चाहते हैं?",
      "म्यूचुअल फंड्स को बेहतर तरीके से समझना चाहते हैं?",
      "अपने दीर्घकालिक वित्तीय लक्ष्यों की योजना बना रहे हैं?",
    ],
    text: "अपनी निवेश आवश्यकताओं पर चर्चा करने और उपयुक्त विकल्पों को जानने के लिए हमसे जुड़ें।",
  },
  contact: {
    heading: "संपर्क करें",
    companyName: "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज",
    tagline: "आपके वित्तीय नियोजक और वेल्थ एडवाइजर",
    mobileLabel: "मोबाइल / व्हाट्सएप",
    emailLabel: "ईमेल",
    websiteLabel: "वेबसाइट",
    amfi: "AMFI पंजीकृत म्यूचुअल फंड वितरक",
    freeConsultTitle: "पहला परामर्श निःशुल्क",
    freeConsultText: "आइए आपके वित्तीय लक्ष्यों और निवेश आवश्यकताओं पर चर्चा करें।",
    form: {
      title: "परामर्श का अनुरोध करें",
      nameLabel: "नाम",
      namePlaceholder: "आपका पूरा नाम",
      phoneLabel: "फोन नंबर",
      phonePlaceholder: "10 अंकों का मोबाइल नंबर",
      emailLabel: "ईमेल",
      emailPlaceholder: "you@example.com",
      requirementLabel: "निवेश आवश्यकता",
      requirementPlaceholder: "एक विकल्प चुनें",
      requirementOptions: {
        mutualFunds: "म्यूचुअल फंड्स",
        sip: "SIP",
        sif: "SIF",
        swp: "SWP",
        stp: "STP",
        etf: "ETF",
        portfolioManagement: "पोर्टफोलियो मैनेजमेंट",
        nps: "NPS",
        bonds: "बॉन्ड्स",
        insurance: "बीमा",
        general: "सामान्य पूछताछ",
      },
      messageLabel: "संदेश",
      messagePlaceholder: "अपनी आवश्यकता के बारे में संक्षेप में बताएं",
      submit: "परामर्श का अनुरोध करें",
      submitting: "भेजा जा रहा है...",
      successTitle: "धन्यवाद",
      successText: "आपका अनुरोध प्राप्त हो गया है। हम शीघ्र ही आपसे संपर्क करेंगे।",
      fallbackTitle: "बस एक कदम और",
      fallbackText:
        "हम आपका अनुरोध स्वचालित रूप से नहीं भेज सके। कृपया अपना विवरण हमें व्हाट्सएप या ईमेल पर भेजें, हम आपसे संपर्क करेंगे।",
      fallbackWhatsapp: "व्हाट्सएप पर भेजें",
      fallbackEmail: "ईमेल से भेजें",
      fallbackWhatsappMessage:
        "नमस्ते, मैं देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज के साथ परामर्श का अनुरोध करना चाहता/चाहती हूं।",
      errorTitle: "कुछ गड़बड़ हो गई",
      errorText: "हम अभी आपका अनुरोध नहीं भेज सके। कृपया पुनः प्रयास करें या हमें व्हाट्सएप पर संपर्क करें।",
      requiredNote: "सभी फ़ील्ड आवश्यक हैं।",
      errors: {
        nameRequired: "कृपया अपना नाम दर्ज करें।",
        phoneRequired: "कृपया अपना फोन नंबर दर्ज करें।",
        phoneInvalid: "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",
        emailRequired: "कृपया अपना ईमेल पता दर्ज करें।",
        emailInvalid: "कृपया एक मान्य ईमेल पता दर्ज करें।",
        requirementRequired: "कृपया एक निवेश आवश्यकता चुनें।",
        messageRequired: "कृपया एक संक्षिप्त संदेश जोड़ें।",
        fixErrors: "कृपया चिह्नित फ़ील्ड सुधारें।",
      },
    },
  },
  disclaimerSection: {
    heading: "महत्वपूर्ण अस्वीकरण",
    paragraphs: [
      "म्यूचुअल फंड निवेश बाजार जोखिम के अधीन हैं। निवेश से पहले सभी योजना संबंधी दस्तावेज़ों को ध्यानपूर्वक पढ़ें।",
      "पिछला प्रदर्शन भविष्य के रिटर्न का संकेत नहीं है।",
      "निवेश निर्णय आपके निवेश उद्देश्यों, जोखिम क्षमता, निवेश अवधि और वित्तीय परिस्थितियों पर विचार करने के बाद लिया जाना चाहिए।",
      "इस वेबसाइट पर दी गई जानकारी सामान्य जानकारी और शैक्षिक उद्देश्यों के लिए है और इसे रिटर्न की गारंटी या व्यक्तिगत वित्तीय सलाह के विकल्प के रूप में नहीं समझा जाना चाहिए।",
    ],
  },
  footer: {
    tagline: "आपके वित्तीय नियोजक और वेल्थ एडवाइजर",
    quickLinksHeading: "त्वरित लिंक",
    servicesHeading: "सेवाएं",
    contactHeading: "संपर्क",
    disclaimerLink: "महत्वपूर्ण अस्वीकरण",
    amfi: "AMFI पंजीकृत म्यूचुअल फंड वितरक",
    arn: "ARN: 289210",
    rights: "© देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज। सर्वाधिकार सुरक्षित।",
    backToTop: "ऊपर जाएं",
  },
  floating: {
    whatsappMessage:
      "नमस्ते, मैं देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज के साथ अपनी निवेश आवश्यकताओं पर चर्चा करना चाहता/चाहती हूं।",
    whatsappAria: "व्हाट्सएप पर हमसे चैट करें",
    whatsappTooltip: "व्हाट्सएप पर चैट करें",
    callAria: "देओलीकर म्यूचुअल फंड्स एंड इन्वेस्टमेंट सर्विसेज को 90755 45105 पर कॉल करें",
    callLabel: "90755 45105 पर कॉल करें",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { en, hi };
