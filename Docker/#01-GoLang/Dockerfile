FROM golang:1.20.13-alpine3.19 as builderGoLang

WORKDIR /go/src/app

ADD . .

RUN go install hello-rocks.go

# MultiStage #

FROM scratch

COPY --from=builderGoLang /go/bin/hello-rocks /go/bin/

CMD [ "/go/bin/hello-rocks" ]