import { sentences } from 'sbd';
import anchorme from 'anchorme';

/** @see https://github.com/kossnocorp/chirrapp/blob/master/src/app/_lib/split/index.js */
export default class ChirrAppUtils {
  constructor() {
    this.limit = 280;
    this.splitStr = '[...]';
    this.ellipsis = '…';

    this.configuration = {
      'version': 2,
      'maxWeightedTweetLength': 280,
      'scale': 100,
      'defaultWeight': 200,
      'transformedURLLength': 23,
      'ranges': [
        {
          'start': 0,
          'end': 4351,
          'weight': 100
        },
        {
          'start': 8192,
          'end': 8205,
          'weight': 100
        },
        {
          'start': 8208,
          'end': 8223,
          'weight': 100
        },
        {
          'start': 8242,
          'end': 8247,
          'weight': 100
        }
      ]
    };
  }

  static joinSentences(a, b) {
    return ((a && [a]) || []).concat(b).join(' ');
  }

  /**
   * @private
   * @param text
   * @returns {*}
   */
  getTweetLength(text) {
    const [textWithoutUrls, urlsLength] = this.removeAndCountUrl(text);
    return [...textWithoutUrls]
      .reduce((acc, char) => {
        const charCodePoint = char.codePointAt(0);
        let charWeight = this.configuration.defaultWeight;
        for (let range of this.configuration.ranges) {
          if (charCodePoint >= range.start && charCodePoint <= range.end) {
            charWeight = range.weight;
            break;
          }
        }
        return acc + charWeight / this.configuration.scale;
      }, urlsLength);
  }

  /**
   * @private
   * @param text
   * @returns {((Partial<Email & File & URL> & BaseTokenProps)|number)[]}
   */
  removeAndCountUrl(text) {
    const listOfLinks = anchorme.list(text);
    const textWithoutUrls = listOfLinks.reduce((acc, link) => acc.replace(link.raw, ''), text);
    const urlsLength = listOfLinks.length * this.configuration.transformedURLLength;
    return [textWithoutUrls, urlsLength];
  }

  /**
   * @private
   * @param tweet
   * @param limit
   * @returns {(string|string)[]|string[]|[string,string]|[string,string]|*|[string,string]|[string,string]}
   */
  sliceTweet(tweet, limit = 0) {
    if (tweet === undefined) {
      throw new Error('no arguments were passed');
    }
    if (typeof tweet !== 'string') {
      throw new Error('first argument must be a string');
    }
    if (limit === 0) {
      // No limit?
      return ['', tweet];
    }
    if (limit > this.getTweetLength(tweet)) {
      // Under the limit
      return [tweet, ''];
    }
    if (limit < 0) {
      // Negative Limit, so chop the limit from the end
      const newLimit = this.getTweetLength(tweet) + limit;
      return this.sliceTweet(tweet, newLimit);
    }

    let firstPart = '';
    let lastPart = '';

    for (let index = 0; index < tweet.length; index += 1) {
      if (this.getTweetLength(firstPart + tweet[index]) > limit) {
        lastPart = tweet.slice(index);
        return [firstPart, lastPart];
      }
      firstPart += tweet[index];
      lastPart = tweet.slice(index + 1);
    }
    return [firstPart, lastPart];
  }

  /**
   * @public
   * Options: { numbering: Boolean, preserve_whitespace: Boolean }
   * @returns {*}
   */
  split(text, options = {}) {
    const { numbering, preserve_whitespace } = {
      ...{ numbering: true, preserve_whitespace: true }, // Defaults
      ...options // Overrides
    };

    let globalAccLength = 0;

    // Thread Count Suffix Length
    const extraNumberWidth = '/ '.length;

    return text
      .split(this.splitStr)
      .map(textChunk => {
        const tweets = sentences(textChunk, { preserve_whitespace })
          .reduce(
            (acc, untrimmedSentence) => {
              // Trimmed Sentence
              const sentence = untrimmedSentence.trim();
              // Working tweet Index
              const lastIndex = acc.length - 1;
              // Working tweet content
              const lastTweet = acc[lastIndex];
              // Working tweet Number
              const currentNumber = globalAccLength + acc.length;
              // Next Tweet Number
              const nextNumber = currentNumber + 1;
              // Thread Count Prepend Length
              const nextNumberWidth = nextNumber.toString().length + extraNumberWidth;
              // Attempt to contacatenate current sentence to Working tweet content
              const concatCandidate = ChirrAppUtils.joinSentences(
                numbering ? lastTweet || `${currentNumber}/` : lastTweet,
                sentence
              );

              // If the current sentence fits the last tweet.
              if (this.getTweetLength(concatCandidate) <= this.limit) {
                // Add the sentence to the last tweet.
                acc[lastIndex] = concatCandidate;

                // If the current sentence is bigger than the tweet limit
              } else if (
                this.getTweetLength(sentence) + (numbering ? nextNumberWidth : 0) >
                this.limit
              ) {
                let indexShift = 0;
                let rest = concatCandidate;
                while (this.getTweetLength(rest) > this.limit) {
                  // Split the last tweet + sentence into two chunks 140 symbols
                  // minus 2 reserved for the ellipsis.
                  const slicePos = this.limit - 1; // - 2 because ellipses weight is equal 2 TODO change number 2 to ellipsis weight
                  const [head, tail] = this.sliceTweet(rest, slicePos);

                  // Find the last space position excluding the number's space
                  let lastSpaceIndex;
                  const numberingCaptures = head.match(/^(\d+\/\s)(.+)$/);
                  // If the head has number (\d+\/\s)
                  if (numberingCaptures) {
                    // Find the last space index excluding the number's space
                    const [, number, headWithoutNumber] = numberingCaptures;
                    const index = headWithoutNumber.lastIndexOf(' ');
                    lastSpaceIndex = index === -1 ? index : number.length + index;
                  } else {
                    lastSpaceIndex = head.lastIndexOf(' ');
                  }
                  if (lastSpaceIndex !== -1) {
                    const tweet = head.slice(0, lastSpaceIndex);
                    const leftover = head.slice(lastSpaceIndex);
                    acc[lastIndex + indexShift] = `${tweet}…`;
                    rest = `${
                      numbering ? `${currentNumber + indexShift + 1}/ ` : ''
                    }…${(leftover + tail).trim()}`;
                  } else {
                    // If the string has no spaces.
                    // Cut off the last symbol in order to give space for the ellipsis
                    const [tweet, leftover] = this.sliceTweet(
                      head,
                      this.limit - this.getTweetLength(this.ellipsis)
                    );
                    acc[lastIndex + indexShift] = `${tweet}${this.ellipsis}`;
                    rest = `${
                      numbering ? `${currentNumber + indexShift + 1}/ ` : ''
                    }${this.ellipsis}${leftover}${tail}`;
                  }
                  indexShift++;
                }
                acc[lastIndex + indexShift] = rest;
                // Otherwise
              } else {
                // Push the sentence as an individual tweet.
                acc.push(`${numbering ? `${nextNumber}/ ` : ''}${sentence}`);
              }
              return acc;
            },
            ['']
          )
          .filter(str => str);

        globalAccLength += tweets.length;
        return tweets;
      })
      .reduce((acc, chunkTweets) => acc.concat(chunkTweets), [])
      .filter(str => str);
  }
}
