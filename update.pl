#!/usr/bin/perl

use warnings;
use strict;
use JSON;

my %result = (
	time => time(),
	aggregators => []
);

# Run all "special" aggregators and combine JSON, inject error info if scan fails
foreach my $a (split(/\n/, `cd lib/special && ls`)) { 
	my $output = from_json(`cd lib/special && ./$a`);
	if($? ne 0 ) {
		$output = { name => $a, status => { fetch => "unknown", details => "Aggregator execution error!"}};
	}
	push(@{$result{aggregators}}, $output);
}
foreach my $s (split(/\n/, `lib/atom-based.pl`)) {
	push(@{$result{aggregators}}, from_json($s));
}

print to_json(\%result);
