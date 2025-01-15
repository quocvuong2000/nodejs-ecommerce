- docker (dev, packaging ,execution)

- Consistency across environments
  - Docker ensures that our app runs the same on my computer, your computer
  - use the same command to run the app "docker run my_app"
  - since download the service like Nodejs isn't the same on Linux, window, macos
  - Dev usually have to deal with different systems
- Isolation
  - Make a clear boundary between our app and its dependencies
- Portability
  - Easily to move our app between different stages (dev -> test)
- Version control
  - Rewind button - go to the previous version
- Scalability
  - make a copy of each application (like restaurant copy multiple menu, each menu serve one customer)
- Devops integration


****************
COMMAND
FROM specify the base image for use
 - FROM image[:tag] [AS name]
 - EX: FROM ubuntu:20.04

WORKDIR set the working directory for the following instructions
  - WORKDIR /path/to/workdir
  - WORKDIR /app

COPY copy the files or directories from the build context to the IMAGE
 - COPY [--chown=<user>:<group>] <src>.. <dest>
 - COPY . /app

RUN execute command in the shell (can use to run specific step)
 - RUN <command>
 - RUN npm run dev

EXPOSE the container will listen on specified Network ports at runtime
 - EXPOSE <port> [<port>/<protocol>...]
 - EXPOSE 3000

ENV set env during the build

ARG define some build time variable
 - ARG <name> [=<default value>]
 - ARG NODE_VERSION=20

VOLUME creates a mount point for externally mounted volumes
specifying a location inside your container where you can connect external connect
 - VOLUME ["/data"]
 - VOLUME /myvol

CMD provides default command to execute when the container starts
 - CMD ["executable","param1","param2"]
 - CMD ["param1","param2"]
 - CMD ["npm","run","dev"]

CMD !== ENTRYPOINT (can't be override)

- docker build -t ...
- docker run -it <name> sh (shell mode)