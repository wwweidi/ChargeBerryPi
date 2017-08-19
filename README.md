# ChargeBerryPi
RFID OCPP RaspberryPi

A device to simulate the behavior of a OCPP Charge Point, based on a RaspberryPi, with a real RFID reader connected

## RFID
https://tutorials-raspberrypi.de/raspberry-pi-rfid-rc522-tueroeffner-nfc/

## OCPP
http://www.gir.fr/ocppjs/

## Metering
simulated in Software

## ChargeControl

USB would be cool with Digispark


## Housekeeping

TODO
- [ ] Autostart of the components
- [ ] keep components alive via forever
- [ ] save shutdown via button
- [ ] feed the hardware watchdog

DONE
- installed avahi https://www.elektronik-kompendium.de/sites/raspberry-pi/1912251.htm to let raspi discover as 'raspberry.local' in the local network through Zeroconf / Bonjour / Avahi 
