# Web-interface-Baikal

Данный проект реализует веб-интерфейс для работы с платой Байкал

## Server local deployment

The following installation guide is fit for Ubuntu.

1. Clone the repository:
   ```
   git clone https://github.com/IvanArkhipov1999/Web-interface-Baikal.git
   ```
2. Install apache http server with php support:
    ```
    sudo apt-get install -y apache2 php libapache2-mod-php
    ```
   1. Deploy the server sources:
       ```
       sudo cp -r <path/to/Web-interface-Baikal>/interface/* /var/www/html
       ```
3. Access `localhost` in your web browser to test the server. 
