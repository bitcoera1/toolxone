/*
==========================================================
TOOLXONE NUMBER ENGINE
----------------------------------------------------------

Purpose
-------
Provides shared number intelligence for ToolXone.

Features
--------
- Format numbers with thousands separators
- Parse formatted numbers safely
- Convert numbers into English words
- Preserve decimal precision
- Reusable across calculators and AI tools

==========================================================
*/

(function () {
    "use strict";


    /* =====================================================
       1. FORMAT NUMBER
       ===================================================== */

    function format(
        value,
        options = {}
    ) {
        const number =
            parse(value);

        if (!Number.isFinite(number)) {
            return "";
        }

        const {
            minimumFractionDigits,
            maximumFractionDigits
        } = resolveFractionOptions(
            value,
            options
        );

        return new Intl.NumberFormat(
            options.locale ||
            "en-US",
            {
                useGrouping:
                    options.useGrouping !== false,

                minimumFractionDigits,

                maximumFractionDigits
            }
        ).format(number);
    }


    /* =====================================================
       2. PARSE FORMATTED NUMBER
       ===================================================== */

    function parse(value) {
        if (
            typeof value === "number"
        ) {
            return Number.isFinite(value)
                ? value
                : NaN;
        }

        const text =
            String(value ?? "")
                .trim();

        if (!text) {
            return NaN;
        }

        const normalized =
            text
                .replace(/,/g, "")
                .replace(/\s+/g, "");

        if (
            !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(
                normalized
            )
        ) {
            return NaN;
        }

        return Number(normalized);
    }


    /* =====================================================
       3. NUMBER TO WORDS
       ===================================================== */

    function words(
        value,
        options = {}
    ) {
        const number =
            parse(value);

        if (!Number.isFinite(number)) {
            return "";
        }

        const {
            includeDecimal = true,
            decimalLimit = 12
        } = options;

        const isNegative =
            number < 0;

        const absoluteValue =
            Math.abs(number);

        const normalized =
            expandScientificNotation(
                absoluteValue
            );

        const [
            integerPart = "0",
            decimalPart = ""
        ] = normalized.split(".");

        const integerWords =
            integerStringToWords(
                integerPart
            );

        const decimalWords =
            includeDecimal &&
            decimalPart
                ? decimalStringToWords(
                    decimalPart.slice(
                        0,
                        decimalLimit
                    )
                )
                : "";

        const result = [
            isNegative
                ? "Minus"
                : "",

            integerWords,

            decimalWords
                ? `Point ${decimalWords}`
                : ""
        ]
            .filter(Boolean)
            .join(" ");

        return result;
    }


    /* =====================================================
       4. FRACTION OPTIONS
       ===================================================== */

    function resolveFractionOptions(
        originalValue,
        options
    ) {
        const explicitMinimum =
            options.minimumFractionDigits;

        const explicitMaximum =
            options.maximumFractionDigits;

        if (
            Number.isInteger(
                explicitMinimum
            ) ||
            Number.isInteger(
                explicitMaximum
            )
        ) {
            return {
                minimumFractionDigits:
                    Number.isInteger(
                        explicitMinimum
                    )
                        ? explicitMinimum
                        : 0,

                maximumFractionDigits:
                    Number.isInteger(
                        explicitMaximum
                    )
                        ? explicitMaximum
                        : Math.max(
                            explicitMinimum || 0,
                            20
                        )
            };
        }

        const decimalLength =
            getDecimalLength(
                originalValue
            );

        return {
            minimumFractionDigits: 0,

            maximumFractionDigits:
                Math.min(
                    Math.max(
                        decimalLength,
                        0
                    ),
                    20
                )
        };
    }


    function getDecimalLength(value) {
        const text =
            String(value ?? "")
                .replace(/,/g, "")
                .trim();

        if (
            /e/i.test(text)
        ) {
            const expanded =
                expandScientificNotation(
                    Number(text)
                );

            return (
                expanded.split(".")[1] ||
                ""
            ).length;
        }

        return (
            text.split(".")[1] ||
            ""
        ).length;
    }


    /* =====================================================
       5. INTEGER WORD CONVERSION
       ===================================================== */

    const SMALL_NUMBERS = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen"
    ];

    const TENS = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"
    ];

    const SCALES = [
        "",
        "Thousand",
        "Million",
        "Billion",
        "Trillion",
        "Quadrillion",
        "Quintillion"
    ];


    function integerStringToWords(
        integerString
    ) {
        const cleaned =
            String(integerString || "0")
                .replace(/^0+(?=\d)/, "");

        if (
            cleaned === "0"
        ) {
            return "Zero";
        }

        const groups = [];

        for (
            let index =
                cleaned.length;

            index > 0;

            index -= 3
        ) {
            groups.unshift(
                cleaned.slice(
                    Math.max(
                        0,
                        index - 3
                    ),
                    index
                )
            );
        }

        const totalGroups =
            groups.length;

        const wordsList = [];

        groups.forEach(
            (
                group,
                index
            ) => {
                const groupNumber =
                    Number(group);

                if (
                    groupNumber === 0
                ) {
                    return;
                }

                const scaleIndex =
                    totalGroups -
                    index -
                    1;

                const groupWords =
                    threeDigitGroupToWords(
                        groupNumber
                    );

                const scaleWord =
                    SCALES[
                        scaleIndex
                    ] || "";

                wordsList.push(
                    [
                        groupWords,
                        scaleWord
                    ]
                        .filter(Boolean)
                        .join(" ")
                );
            }
        );

        return wordsList.join(" ");
    }


    function threeDigitGroupToWords(
        number
    ) {
        const parts = [];

        const hundreds =
            Math.floor(
                number / 100
            );

        const remainder =
            number % 100;

        if (
            hundreds > 0
        ) {
            parts.push(
                `${SMALL_NUMBERS[hundreds]} Hundred`
            );
        }

        if (
            remainder > 0 &&
            remainder < 20
        ) {
            parts.push(
                SMALL_NUMBERS[
                    remainder
                ]
            );
        } else if (
            remainder >= 20
        ) {
            const tens =
                Math.floor(
                    remainder / 10
                );

            const ones =
                remainder % 10;

            parts.push(
                TENS[tens]
            );

            if (
                ones > 0
            ) {
                parts.push(
                    SMALL_NUMBERS[
                        ones
                    ]
                );
            }
        }

        return parts.join(" ");
    }


    /* =====================================================
       6. DECIMAL WORD CONVERSION
       ===================================================== */

    function decimalStringToWords(
        decimalString
    ) {
        return String(
            decimalString || ""
        )
            .split("")
            .map(digit => {
                return SMALL_NUMBERS[
                    Number(digit)
                ];
            })
            .join(" ");
    }


    /* =====================================================
       7. SCIENTIFIC NOTATION EXPANSION
       ===================================================== */

    function expandScientificNotation(
        value
    ) {
        const text =
            String(value);

        if (
            !/[eE]/.test(text)
        ) {
            return text;
        }

        const [
            coefficient,
            exponentText
        ] = text
            .toLowerCase()
            .split("e");

        const exponent =
            Number(exponentText);

        const [
            whole,
            fraction = ""
        ] = coefficient.split(".");

        const digits =
            `${whole}${fraction}`;

        const decimalIndex =
            whole.length + exponent;

        if (
            decimalIndex <= 0
        ) {
            return (
                "0." +
                "0".repeat(
                    Math.abs(
                        decimalIndex
                    )
                ) +
                digits.replace(
                    /^-/,
                    ""
                )
            );
        }

        if (
            decimalIndex >=
            digits.length
        ) {
            return (
                digits +
                "0".repeat(
                    decimalIndex -
                    digits.length
                )
            );
        }

        return (
            digits.slice(
                0,
                decimalIndex
            ) +
            "." +
            digits.slice(
                decimalIndex
            )
        );
    }


    /* =====================================================
       8. PUBLIC API
       ===================================================== */

    window.ToolXoneNumberEngine =
        Object.freeze({
            format,
            parse,
            words
        });

})();