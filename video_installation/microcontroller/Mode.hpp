#pragma once

class Mode {
public:
  virtual void reset();
  virtual boolean step();
  virtual const char *name();
};
