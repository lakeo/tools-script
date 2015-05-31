#!/bin/bash

set -e

brew remove sphinx
brew install sphinx --with-mysql
