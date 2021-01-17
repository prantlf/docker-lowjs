FROM alpine:latest as builder
RUN cd /root && \
	wget https://www.neonious.com/lowjs/downloads/lowjs-linux-x86_64-20201229_93a94a9.tar.gz && \
	tar xf lowjs-linux-x86_64-20201229_93a94a9.tar.gz && \
	rm lowjs-linux-x86_64-20201229_93a94a9/LICENSE lowjs-linux-x86_64-20201229_93a94a9/README.md && \
	mkdir lowjs-linux-x86_64-20201229_93a94a9/root

FROM scratch
LABEL maintainer="Ferdinand Prantl <prantlf@gmail.com>"
COPY --from=builder /root/lowjs-linux-x86_64-20201229_93a94a9 /
WORKDIR /root
EXPOSE 80 443
ENTRYPOINT ["/bin/low"]
CMD ["-h"]
