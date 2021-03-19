#!/usr/bin/perl

use warnings;
use strict;
use XML::Feed;
use JSON;

binmode(STDOUT, "encoding(UTF-8)");

open FILE, "conf/atom-feeds.json" or die $!;
my @json = <FILE>;
my $config = from_json(join('',@json));
close FILE;

my $today=`date -I`;
chomp $today;

foreach my $k (sort(keys %$config)) {
	my $data = `curl -Lks "$config->{$k}->{feed}"`;
	my %status = %{$config->{$k}};
	$status{name} = $k;
	$status{results} = [];
	unless(defined($status{url})) {
		$status{url} = $status{feed};
		$status{url} =~ s#/[^/]+$##;
	}

        eval {
		my $feed = XML::Feed->parse(\$data);

		unless(defined($feed) && defined($feed->entries)) {
			$status{fetch} = "unknown";
			$status{details} = "Parsing failed!";
		} else {
			$status{fetch} = "OK";
			foreach ($feed->entries) {
				next unless($_->updated =~ /^$today/);
				push(@{$status{'results'}}, {
					time		=> $_->updated->strftime("%F %H:%M"),
					title		=> $_->title =~ s/<[^>]*>/ /gr,
					description	=> $_->content->body =~ s/<[^>]*>/ /gr
				});
			}
		}

		1;
	} or do {
		$status{fetch} = "FAILED";
		$status{details} = "Fetch fetch failed!";
		warn "Fetch failed for '$k': $_";
	};

	eval {
		print to_json(\%status) . "\n";
		1;
	} or do {
		use Data::Dumper;
		warn "Data serialization failed: ".Dumper(\$status{results})."\n";

		$status{fetch} = "FAILED";
		$status{results} = [];
		$status{details} = "Data serialization failed!";
		print to_json(\%status) . "\n";
	}
}
