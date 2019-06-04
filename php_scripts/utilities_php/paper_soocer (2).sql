-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 04 Cze 2019, 20:51
-- Wersja serwera: 10.1.40-MariaDB
-- Wersja PHP: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `paper_soocer`
--
CREATE DATABASE IF NOT EXISTS `paper_soocer` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `paper_soocer`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `session`
--

CREATE TABLE `session` (
  `id_session` int(11) NOT NULL,
  `user1` int(11) NOT NULL,
  `player1_color` int(1) NOT NULL,
  `user2` int(11) NOT NULL,
  `player2_color` int(1) NOT NULL,
  `game_data` mediumtext COLLATE utf8_polish_ci NOT NULL,
  `whose_move` tinyint(1) NOT NULL,
  `who_win` int(1) NOT NULL,
  `game_id` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `login` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `is_logged` tinyint(1) NOT NULL,
  `date_last_login` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id_user`, `login`, `password`, `is_logged`, `date_last_login`) VALUES
(9, 'dejw', '$2y$10$iH5/RLfQ93xz.cbajQf6i.fcZVazfCoiiNBs5SK/P0M46fXHUwmrO', 1, 1559668369),
(10, 'bartek', '$2y$10$R39U2VBLpggi93xXTS45XevVjPGqywBlO1DcSeiC7GGMzG.TeEcsO', 1, 1559668369),
(11, 'andrzej', '$2y$10$CEF1q2m8mIwCRxVyVK1fe.0zVoJuU63JowBLGzyRomo6EWYJRnyna', 1, 1559667898),
(12, 'shrek', '$2y$10$imxIgFDAJpDx6FKqcHV1kuV45iBArYSxKrX3ciFEm99fRuP0uerkm', 0, 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id_session`),
  ADD KEY `session_fk0` (`user1`),
  ADD KEY `session_fk1` (`user2`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `session`
--
ALTER TABLE `session`
  MODIFY `id_session` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
