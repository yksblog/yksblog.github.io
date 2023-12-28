#!/bin/bash
path=$PWD
cd $path
rsync -azvP --delete ./ rich:/home/yk/static/org/themes/
