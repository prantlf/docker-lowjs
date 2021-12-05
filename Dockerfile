FROM alpine:latest as builder
RUN cd /root && \
	wget -q https://www.neonious.com/lowjs/downloads/lowjs-linux-x86_64-20210228_3479cc6.tar.gz && \
	tar xf lowjs-linux-x86_64-20210228_3479cc6.tar.gz && \
	rm lowjs-linux-x86_64-20210228_3479cc6/LICENSE lowjs-linux-x86_64-20210228_3479cc6/README.md && \
	mkdir lowjs-linux-x86_64-20210228_3479cc6/root

FROM scratch
LABEL maintainer="Ferdinand Prantl <prantlf@gmail.com>"
COPY --from=builder /root/lowjs-linux-x86_64-20210228_3479cc6 /
WORKDIR /root
EXPOSE 80 443
ENTRYPOINT ["/bin/low"]
CMD ["-h"]
