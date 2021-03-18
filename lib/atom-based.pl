#!/usr/bin/perl

use warnings;
use strict;
use XML::Feed;
use JSON;

open FILE, "conf/atom-feeds.json" or die $!;
my @json = <FILE>;
my $config = from_json(join('',@json));
close FILE;

my $today=`date -I`;
chomp $today;

foreach my $k (keys %$config) {
	my $data = `curl -Lks "$config->{$k}->{feed}"`;
	my %status = %{$config->{$k}};
	$status{name} = $k;
	$status{results} = [];
	unless(defined($status{url})) {
		$status{url} = $status{feed};
		$status{url} =~ s#/[^/]+$##;
	}
	my $feed = XML::Feed->parse(\$data);

	unless(defined($feed) && defined($feed->entries)) {
		$status{fetch} = "unknown";
		$status{details} = "Fetch fetch failed!";
	} else {
		$status{fetch} = "OK";
		foreach ($feed->entries) {
			next unless($_->updated =~ /^$today/);
			push(@{$status{'results'}}, {
				time		=> $_->updated,
				title		=> $_->title,
				description	=> $_->content->body
			});
		}
	}

	print to_json(\%status) . "\n";
}
