#!/bin/bash
path=$PWD
cd $path
rsync -azvP --delete ./ rich:~/static/org/blog/