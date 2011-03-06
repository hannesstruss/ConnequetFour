#!/bin/bash

# Check all files in a certain directory with JSHint/Node.js
# First parameter must be the root directory, second the jshint options file

TEMPFILE="/tmp/jshint_all.$$.tmp"

COUNT=0

for jsfile in `find $1 -iname "*.js" | grep -v /lib/`
do
	# when not piped through cat, only the first line of the output is saved...?!
	node jshint-node.js $jsfile $2 | cat - > $TEMPFILE
	
	EXIT=${PIPESTATUS[0]}
	
	if [ $EXIT != 0 ] 
	then
		COUNT=`expr $COUNT + 1`
		
		echo "###########################################################"
		echo $jsfile | sed "s=$1=="
		echo "###########################################################"
		echo
		cat $TEMPFILE
		echo
	fi
done 

echo
echo ">>> JSHint done! Found $COUNT invalid files."

rm $TEMPFILE