#include <Arduino.h>
#include "IdleMode.hpp"

const char *IdleMode::name() {
  return "idle";
}

boolean IdleMode::step() {
  delay(250);
  return true;
}
