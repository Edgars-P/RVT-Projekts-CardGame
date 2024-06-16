{ pkgs ? import <nixpkgs> {} }:

let

	# get pocketbase from github release archive
	newPocketbase = pkgs.buildGoModule rec {
		name = "pocketbase";
		version = "v0.22.9";

		src = pkgs.fetchFromGitHub {
			owner = "pocketbase";
			repo = "pocketbase";
			rev = "v${version}";
			sha256 = "sha256-9LIOBfNOa+u7yLL7iWb/e7c8ZSiyjukqaY0ifVR2iSs=";
		};

		vendorHash = "sha256-LFIJClPByaLXtsBOk7SjpJlIuQhWbVIs6H4PXhd7oyo=";

		# This is the released subpackage from upstream repo
		subPackages = [ "examples/base" ];

		CGO_ENABLED = 0;

		# Upstream build instructions
		ldflags = [
			"-s"
			"-w"
			"-X github.com/pocketbase/pocketbase.Version=${version}"
		];

		postInstall = ''
			mv $out/bin/base $out/bin/pocketbase
		'';
	};


in pkgs.mkShell {
  packages = with pkgs; [
    nodejs_18
		nodePackages.pnpm
		newPocketbase
		caddy
		cloudflared
  ];

}