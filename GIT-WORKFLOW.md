flowchart TD
A[Start Feature()] --> B[Create Branch: feat/auth-login]

    B --> C[Write Code]
    C --> D[Commit: feat(auth): add login endpoint] // try to make the commit not long if possible

    D --> E[Push Branch]
    E --> F[Open PR #42]

    F --> G[Review Process]

    G -->|Fix Needed| H[fix(auth): handle edge case]
    H --> E

    G -->|Approved| I[Merge PR]

    I --> J[feat(auth): add login endpoint (#42)]
    J --> K[Deploy / Main Updated]
