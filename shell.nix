{ pkgs ? import <unstable> {} }:

let

in pkgs.mkShell {
  packages = with pkgs; [
    nodejs_18
		nodePackages.pnpm
		pocketbase
  ];

}