FROM nginx:1.25.1

RUN mkdir /usr/share/nginx/html/stats

# Expose port 80 (default HTTP port)
EXPOSE 80
