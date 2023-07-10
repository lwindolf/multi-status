#!/usr/bin/perl

use warnings;
use strict;
use JSON;

my %result = (
	time => time(),
	aggregators => []
);

foreach my $s (split(/\n/, `./feed-parser.pl`)) {
	push(@{$result{aggregators}}, from_json($s));
}

# Perform categorizing...
#
# We want to detect by pattern matching the details
#
# type:
# - maintenance/scheduled
# - incident/outage
# - service degraded
#
# status:
# - resolved/completed
# - investigating
foreach my $a (@{$result{aggregators}}) {
	foreach my $r (@{$a->{results}}) {

		# Order is important!
		$r->{type} = 'maintenance' if($r->{description} =~ /(maintenance|scheduled)/i);
		$r->{type} = 'incident' if($r->{description} =~ /(incident|outage|degraded)/i);
		$r->{type} = 'incident' unless(defined($r->{type}));

		# Order is important!
		$r->{status} = 'investigating' if($r->{description} =~ /(investigating|monitoring)/i);
		$r->{status} = 'resolved' if($r->{description} =~ /(resolved)/i);
		$r->{status} = 'completed' if($r->{description} =~ /(completed)/i);

	}
}

print to_json(\%result);
