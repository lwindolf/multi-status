#!/usr/bin/perl

use warnings;
use strict;
use XML::Feed;
use JSON;

binmode(STDOUT, "encoding(UTF-8)");

open FILE, "conf/feeds.json" or die $!;
my @json = <FILE>;
my $config = from_json(join('',@json));
close FILE;

# Prepare 2 today strings matching the date in RFC-822 (for RSS) and ISO-8601 (Atom)
my $today=`date -I`;
my $today2=`date -R | awk '{print \$1,\$2,\$3,\$4}'`;
chomp $today;
chomp $today2;

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
			foreach my $e ($feed->entries) {
				my $time = undef;

				if(blessed $e eq 'XML::Feed::Entry::Format::Atom') {
					next unless($e->updated =~ /^$today/);
					if(ref($e->updated) eq '') {
						$time = $e->updated;
					} else {
						$time = $e->updated->epoch;
					}
				}

				if(blessed $e eq 'XML::Feed::Entry::Format::RSS') {
					next unless($e->{entry}->{pubDate} =~ /^$today2/);
					$time = $e->{entry}->{pubDate};
				}
				next unless(defined($time));

				push(@{$status{'results'}}, {
					time		=> $time,
					title		=> $e->title =~ s/<[^>]*>/ /gr,
					description	=> $e->content->body =~ s/<[^>]*>/ /gr
				});
			}
		}

		1;
	} or do {
		$status{fetch} = "FAILED";
		$status{details} = "Fetch fetch failed!";
		warn "Fetch failed for '$k': $@";
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
