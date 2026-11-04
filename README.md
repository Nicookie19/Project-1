# Forma — a simple static website

A responsive starter made with HTML, CSS, and JavaScript. No npm, framework, database, external fonts, or build step. Includes a mobile menu, project filters, and a saved light/dark preference. All artwork is CSS.

## Preview

Open `index.html` directly in your browser, or run this from the project directory:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. Stop the server with Ctrl+C.

## Customize before publishing

- In `index.html`, replace the Forma name, description, introductory text, and example projects with your own content. The two projects are illustrative concepts.
- Replace `hello@example.com` in the contact link with your email address. This link opens the visitor's email application; there is no form or email backend.
- Change the colors in `styles.css` under `:root` and `body.dark`.
- Only `index.html`, `styles.css`, and `script.js` need to be served publicly.

## Deploy to Ubuntu with Nginx

These instructions assume SSH access, a sudo-enabled account, and an Ubuntu server with apt. Replace `YOUR_USER` and `YOUR_SERVER_IP` in the upload command. No server changes have been made by this project.

1. From your computer, upload the files to your server's home directory:

   ```sh
   scp index.html styles.css script.js nginx.conf YOUR_USER@YOUR_SERVER_IP:~/
   ```

2. SSH into the server, then install Nginx and copy the public files:

   ```sh
   sudo apt update
   sudo apt install -y nginx
   sudo install -d -m 755 /var/www/forma
   sudo install -m 644 ~/index.html ~/styles.css ~/script.js /var/www/forma/
   sudo install -m 644 ~/nginx.conf /etc/nginx/sites-available/forma
   ```

3. For a new server using its IP address, disable the default welcome site and enable Forma:

   ```sh
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo ln -sfn /etc/nginx/sites-available/forma /etc/nginx/sites-enabled/forma
   sudo nginx -t && sudo systemctl enable --now nginx && sudo systemctl reload nginx
   ```

   If the server already hosts websites, keep their configurations. Replace `server_name _;` in the Forma config with your domain (for example, `server_name example.com www.example.com;`) before enabling it. Point your domain's DNS records to the server. The `_` name is a placeholder, not a universal wildcard; an IP-only setup assumes this is the only enabled site.

4. Open `http://YOUR_SERVER_IP` (or your configured domain). If UFW is active, allow web traffic with `sudo ufw allow 'Nginx Full'`. Also permit inbound TCP port 80 in your server provider's firewall, if applicable.

The included config serves HTTP. For a public domain, configure an HTTPS certificate before production use, and permit port 443. To update the website later, upload and copy the three public files again; content-only edits do not require an Nginx reload.
