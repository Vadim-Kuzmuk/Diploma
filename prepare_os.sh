#!/bin/sh
sudo apt update -y
sudo apt upgrade -y


sudo add-apt-repository universe
sudo apt install -y gnome-tweaks
#sudo apt install -y software-center
#sudo apt install -y gnome-software

# Install Google Chrome browser
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P Downloads/
sudo dpkg -i --force-depends Downloads/google-chrome-stable_current_amd64.deb

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update -y
sudo apt install -y docker-ce
sudo usermod -aG docker ${USER}

# Install Docker-compose
sudo curl -SL https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod a+x /usr/local/bin/docker-compose

sudo apt install -y mc
sudo apt install -y htop
sudo apt install -y net-tools
sudo apt install -y chromium-browser
sudo apt install -y telegram-desktop

gsettings set org.gnome.desktop.wm.keybindings switch-input-source "['<Shift>Alt_L']"
gsettings set org.gnome.desktop.wm.keybindings switch-input-source-backward "['<Alt>Shift_L']"

sudo snap install zoom-client
sudo snap install phpstorm --classic
