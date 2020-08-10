clean ::
	docker image rm lowjs

lint ::
	docker run --rm -i \
		-v ${PWD}/.hadolint.yaml:/bin/hadolint.yaml \
		-e XDG_CONFIG_HOME=/bin hadolint/hadolint \
		< Dockerfile

build ::
	docker build -t lowjs .

run ::
	docker run --rm -it lowjs

tag ::
	docker tag lowjs prantlf/lowjs:latest

login ::
	docker login --username=prantlf

push ::
	docker push prantlf/lowjs:latest
