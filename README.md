# Butterfy 

**Crowdfiltering the web.** <br/>
**For meaningful content**

Butterfy is a democratic collection of meaningful content. Sourced and curated by the people, not by an algorithm or a newsroom. Here, you decide in a 4-staged voting process together with everyone else what content has the potential for impact. Looking for the signal within the noise. We call that crowdfiltering


<img src="https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/605735c0edaac929c273ba2d_Crowdfiltering_long.gif" width="400"/>

👉 [Read More on butterfy.me](https://butterfy.me)

## Current Stage

This is a very early prototype of the concept developed during the Rethink Journalism 21 Hackaton:

<a href="https://opendata.ch/projects/rethink-journalism-hackathon-may-7th-8th-2021/" rel="noopener noreferrer"><img src="https://opendata.ch/wordpress/files/2021/03/RZ_LOGO_HACKATHON_RGB-1.png" width="300"/></a>


## Development

1. docker-compose up -d
2. Run migrations.sql
3. cp .env.example .env
4. npm install
5. npm run dev

<!-- --- tips to "Run migrations.sql" -->

docker-compose up -d
docker images
docker ps

docker exect -it NAME_CONTAINER /bin/bash
psql -U NAME -d NAME -f migrations.sql

## GraphQL Playground

Change in settings: `"request.credentials": "same-origin"`