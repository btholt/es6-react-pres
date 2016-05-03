#!/usr/bin/env bash

export PYTHONUNBUFFERED=1
export ANSIBLE_FORCE_COLOR=1

# Only run through the full install if Ansible hasn't been installed yet
if [ $(dpkg-query -W -f='${Status}' ansible 2>/dev/null | grep -c "ok installed") -eq 0 ];
then

  echo "Configuring the Server:"
  export DEBIAN_FRONTEND=noninteractive

  echo "  1/7. Update apt"
  apt-get update -qq &> /dev/null || exit 1

  echo "  2/7. Install python-software-properties python-apt python-pycurl"
  apt-get install -qq software-properties-common python-apt python-pycurl &> /dev/null || exit 1

  echo "  3/7. Add Ansible PPA"
  apt-add-repository ppa:ansible/ansible &> /dev/null || exit 1

  echo "  4/7. Update apt to grab new PPA info for Ansible"
  apt-get update -qq &> /dev/null || exit 1

  echo "  5/7. Install Ansible"
  apt-get install -qq ansible &> /dev/null || exit 1

  echo "  6/7. Remove auto-installed packages that are no longer required"
  apt-get -y autoremove &> /dev/null || exit 1

  echo "  7/7. Upgrading all packages"
  apt-get -y dist-upgrade &> /dev/null || exit 1

else
  echo "Server Configuration already completed, skipping to Ansible Playbook"

fi

echo "Ansible Provisioning:"

cd /vagrant/inf/ansible

echo "  1/2. Install Ansible Galaxy Roles"
ansible-galaxy install -r requirements.txt --force

echo "  2/2. Ansible (allthethings)..."
ansible-playbook vagrant.yml --inventory-file=inventory/vagrant.ini --connection=local

echo "Ansible Provisioning: Done!"
