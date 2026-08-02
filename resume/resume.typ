#set page(margin: 0.5in)
#set text(font: "Times New Roman", size: 10pt, hyphenate: false)
#set par(justify: false, leading: 0.55em, spacing: 10pt)
#show heading.where(level: 1): it => {
  v(10pt, weak: true)
  text(size: 12pt, weight: "bold", upper(it.body))
  v(10pt, weak: true)
}
#show heading.where(level: 2): it => {
  v(10pt, weak: true)
  text(size: 12pt, weight: "bold", it.body)
  v(10pt, weak: true)
}

#align(center)[
  #text(size: 18pt, weight: "bold")[Joshini Meenakshisundaram Naagraj]

  joshini.mn\@gmail.com • San Jose, CA • linkedin.com/in/joshini-m-n/
]

= Summary
Backend-focused software engineer with 7+ years of experience building scalable systems in Java and distributed architectures. Proven expertise in designing and implementing RESTful APIs and microservices, along with cloud technologies like AWS and Azure. Demonstrated ability to debug complex issues and deliver high-reliability solutions while collaborating across teams.

= Skills
*Programming:* Java, Python, SQL, C \
*Backend & APIs:* Spring Boot, REST APIs, Microservices, Kafka \
*Frontend:* Angular, TypeScript \
*Databases:* MySQL, Oracle, MongoDB, Postgres, IBM DB2 \
*Operating Systems:* Linux \
*Cloud & DevOps:* AWS, Azure, Terraform, CI/CD, Jenkins \
*Tools:* Splunk, Dynatrace, Postman, Git, Robo3T, Eclipse, Jira, Confluence \

= Professional Experience
#block(breakable: false)[
== LTIMindtree - Specialist Software Engineer
_India | Nov 2022 - Aug 2024_
- Converted a standalone Java application into multiple microservices communicating via Kafka, including hands-on Kafka configuration, reducing queued message processing time from 20 minutes to 5 minutes (75% reduction), improving throughput.
- Designed and implemented RESTful APIs with authentication and authorization for high-volume transaction processing.
- Debugged and resolved 100+ production issues, including full testing coverage, improving system stability and reliability.
- Converted legacy MVC-based UI screens to Angular (TypeScript) for a banking application, delivering two full screen conversions as a full-stack individual contributor.
]

#block(breakable: false)[
== Accenture - Application Development Senior Analyst
_India | Jan 2020 - Nov 2022_
- Contributed to modular and scalable system design within a microservices-based architecture.
- Developed and maintained backend services using Java and Oracle SQL for enterprise applications.
- Monitored cloud applications on Microsoft Azure using Splunk dashboards and Dynatrace for log analysis and performance optimization.
- Wrote and analyzed queries across MongoDB, Postgres, and IBM DB2 for enterprise application data.
- Took on sprint planning and task assignment for team members as a senior contributor under Agile/Scrum methodology.
- Implemented CI/CD practices in project workflows to deliver features within defined timelines and project requirements.
- Updated and analyzed data in MongoDB to support application features and reporting needs.
- Conducted functional and integration testing across backend, frontend, and database layers.
- Provided client support and resolved production issues, ensuring operational reliability.
]

#block(breakable: false)[
== Infosys - Senior System Engineer
_India | Jan 2017 - May 2019_
- Developed Java-based backend systems using messaging frameworks and worked with Java, SQL, JAXB, and JMS APIs for backend integration tasks.
- Collaborated with team members to identify and resolve system issues.
- Gained foundational experience in Java, MySQL, Python, and AngularJS.
]

= Projects
#block(breakable: false)[
== CS30 Secure Coding Lab
_San José State University | Apr 2026 - Present_
- Built the entire frontend for a greenfield secure coding lab in Kotlin Multiplatform + Compose, targeting desktop and browser (wasmJs) from one codebase, for planned live deployment to SJSU students.
- Integrated a Spring Boot service (Google OAuth, problem delivery, git-backed autosave) and a Python/FastAPI judge that runs student submissions in Docker sandboxes.
- Developed the code editor with syntax highlighting and auto-indent, plus an exam lockdown system with activity logging, a violations banner, and fullscreen enforcement.
]

#block(breakable: false)[
== Serverless Sentiment Analysis System
_Dec 2025_
- Developed a full-stack sentiment analysis platform using DistilBERT, supporting real-time and batch inference via API-driven workflows, while optimizing model inference with ONNX Runtime for efficient CPU execution.
- Implemented CI/CD with GitHub Actions to automate model export, infrastructure provisioning, and deployment.
]

#block(breakable: false)[
== LLM Input Monitoring & Sensitive Data Detection System
_Dec 2025_
- Implemented LLM-based detection to flag sensitive information during prompt interactions while ensuring privacy-preserving processing by running all analysis locally without external data transmission.
- Developed a browser extension and backend service to capture and analyze user inputs from LLM applications in real time, incorporating debugging processes to ensure reliability.
]

= Education
#block(breakable: false)[
== San Jose State University, San Jose, USA
Master of Science (M.S.), Software Engineering \
Member, Phi Kappa Phi Honor Society
]

#block(breakable: false)[
== Anna University, Chennai, India
Bachelor of Engineering (B.E.), Electronics and Instrumentation Engineering
]

= Certifications
- AWS Solutions Architect Associate (Jan 2026)
- Oracle Certified Associate, Java SE 8 (Feb 2023)
- AWS Certified Developer Associate (Aug 2020 - Aug 2021)

= Leadership & Activities
#block(breakable: false)[
== Volunteer Mentor - Develop for Good
_May 2025 - Aug 2025_
- Mentored student teams on web development projects, guiding architecture, implementation, and delivery.
]
