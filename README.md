# Open Source Chat Application

**File Structure 📂** 
- `components`: List of reusabled components used
- `database`: Where prisma client and schema resides
- `hooks`: Where custom hooks are stored
- `pages`: NextJS pages directory
- `server`: Where tRPC server logic are, ranging from routers to schemas
- `styles`: Basic global CSS
- `utils`: tRPC and AWS util functions
- `template.env`: An example of what environmental variables you need in other to run the application

**Technology Stack**
- [NextJS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [MongoDB](https://www.mongodb.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Mantine](https://mantine.dev/)
- [Zod](https://zod.dev/)

**How to run application**

```
git clone https://github.com/damiisdandy/aerial-ops-chat.git chat-app

cd chat-app

yarn

# setup environmental variables from `template.env`

yarn dev
```

**Screenshots**
![Empty chat](/src/images/blank.png?raw=true "Empty Chat")
<br/>
<br/>
<br/>
![Chat](/src/images/content.png?raw=true "Chat")
