FROM ruby:3.1.2

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

# Install a file watcher (optional, for auto-reloading)
RUN gem install rerun

EXPOSE 4567

CMD ["rerun", "--pattern", "**/*.{rb,erb}", "--", "bundle", "exec", "rackup", "-p", "4567", "-o", "0.0.0.0"]



