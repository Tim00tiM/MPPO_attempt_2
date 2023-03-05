FROM python:alpine3.17

WORKDIR web

COPY requirements.txt requirements.txt
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

RUN cd /web
COPY app.py app.py
COPY server.py server.py
COPY setup.py setup.py
COPY entrypoint.sh entrypoint.sh
EXPOSE 5000
RUN chmod a+x entrypoint.sh

# CMD ["/web/entrypoint.sh"]
# CMD ["python", "app.py"]

# RUN chmod a+x entrypoint.sh
ENTRYPOINT source entrypoint.sh
# # CMD ["/web/entrypoint.sh"]
# CMD ["source", "entrypoint.sh"]